// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
//     const url = new URL(tab.url);
//     const domain = url.hostname;

//     chrome.storage.local.get("visitedSites", (data) => {
//       const visitedSites = data.visitedSites || {};

//       if (!visitedSites[domain]) {
//         visitedSites[domain] = {
//           firstVisited: new Date().toISOString(),
//           pages: [],
//           cookies: [],
//         };
//       }

//       visitedSites[domain].pages = Array.from(new Set([
//         ...(visitedSites[domain].pages || []),
//         tab.url
//       ]));

//         chrome.cookies.getAll({ url: tab.url }, (cookies) => {
//         const existingCookies = visitedSites[domain].cookies || [];

//         cookies.forEach((cookie) => {
//             const alreadyExists = existingCookies.some((c) =>
//             c.name === cookie.name &&
//             c.domain === cookie.domain &&
//             c.path === cookie.path
//             );

//             if (!alreadyExists) {
//             existingCookies.push(cookie);
//             }
//         });

//         visitedSites[domain].cookies = existingCookies;

//         chrome.storage.local.set({ visitedSites }, () => {
//             console.log(`Updated cookies for ${domain}`);
//         });
//         });

//     });
//   }
// });




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

      const pages = visitedSites[domain].pages || [];

      const existingPage = pages.find(p => p.url === tab.url);
      if (existingPage) {
        existingPage.lastVisited = new Date().toISOString();
      } else {
        pages.push({
          url: tab.url,
          lastVisited: new Date().toISOString()
        });
      }

      visitedSites[domain].pages = pages;

      chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        const existingCookies = visitedSites[domain].cookies || [];

        cookies.forEach((cookie) => {
          const alreadyExists = existingCookies.some((c) =>
            c.name === cookie.name &&
            c.domain === cookie.domain &&
            c.path === cookie.path
          );

          if (!alreadyExists) {
            existingCookies.push(cookie);
          }
        });

        visitedSites[domain].cookies = existingCookies;

        chrome.storage.local.set({ visitedSites });
      });
    });
  }
});
