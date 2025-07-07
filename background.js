chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    const url = new URL(tab.url);
    const hostname = url.hostname;

    chrome.storage.local.get("visitedSites", (data) => {
      const visitedSites = data.visitedSites || {};

      if (!visitedSites[hostname]) {
        visitedSites[hostname] = {
          firstVisited: new Date().toISOString(),
          pages: [],
          cookies: [],
        };
      }

      const pages = visitedSites[hostname].pages || [];
      const existingPage = pages.find(p => p.url === tab.url);

      if (existingPage) {
        existingPage.lastVisited = new Date().toISOString();
      } else {
        pages.push({
          url: tab.url,
          lastVisited: new Date().toISOString()
        });
      }

      visitedSites[hostname].pages = pages;

      // Get all cookies visible on the page (including 3rd-party cookies)
      chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        const existingCookies = visitedSites[hostname].cookies || [];

        cookies.forEach((cookie) => {
          const alreadyExists = existingCookies.some((c) =>
            c.name === cookie.name &&
            c.domain === cookie.domain &&
            c.path === cookie.path
          );

          if (!alreadyExists) {
            const isFirstParty = (
              cookie.domain === hostname ||
              cookie.domain.endsWith(`.${hostname}`)
            );

            existingCookies.push({
              ...cookie,
              party: isFirstParty ? "first-party" : "third-party"
            });
          }
        });

        visitedSites[hostname].cookies = existingCookies;

        chrome.storage.local.set({ visitedSites });
      });
    });
  }
});
