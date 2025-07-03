chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    const url = new URL(tab.url);
    const domain = url.hostname;

    chrome.storage.local.get("visitedSites", (data) => {
      const visitedSites = data.visitedSites || {};

      if (!visitedSites[domain]) {
        visitedSites[domain] = {
          firstVisited: new Date().toISOString(),
          pages: [],
          cookies: [],
        };
      }

      visitedSites[domain].pages = Array.from(new Set([
        ...(visitedSites[domain].pages || []),
        tab.url
      ]));

        chrome.cookies.getAll({ url: tab.url }, (cookies) => {
            console.log(`Cookies for ${domain}:`, cookies);

            if (cookies.length > 0) {
                visitedSites[domain].cookies = cookies;
            }

            chrome.storage.local.set({ visitedSites }, () => {
                console.log(`✅ Stored pages + cookies for ${domain}`);
            });
        });

    });
  }
});
