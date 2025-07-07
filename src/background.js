import { parse } from 'tldts';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    const url = new URL(tab.url);
    const hostname = url.hostname;

    const { domain: baseDomain } = parse(hostname);

    if (!baseDomain) return;

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

      chrome.cookies.getAll({ domain: baseDomain }, (cookies) => {
        // ✅ Use only filtered cookies
        const filteredCookies = cookies.filter(c =>
          c.domain === baseDomain || c.domain.endsWith(`.${baseDomain}`)
        );

        const existingCookies = visitedSites[hostname].cookies || [];

        filteredCookies.forEach((cookie) => {
          const alreadyExists = existingCookies.some((c) =>
            c.name === cookie.name &&
            c.domain === cookie.domain &&
            c.path === cookie.path
          );

          if (!alreadyExists) {
            existingCookies.push(cookie);
          }
        });

        visitedSites[hostname].cookies = existingCookies;

        chrome.storage.local.set({ visitedSites });
      });
    });
  }
});
