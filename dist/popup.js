/******/ (() => { // webpackBootstrap
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
// document.addEventListener("DOMContentLoaded", () => {
//   const siteList = document.getElementById("site-list");

//   chrome.storage.local.get("visitedSites", (result) => {
//     console.log("VisitedSites data from storage:", result);

//     const visitedSites = result.visitedSites || {};
//     siteList.innerHTML = ""; 

//     if (Object.keys(visitedSites).length === 0) {
//       siteList.textContent = "No data available.";
//       return;
//     }

//     for (const [domain, info] of Object.entries(visitedSites)) {
//       const domainBlock = document.createElement("div");
//       domainBlock.className = "domain-block";

//       const header = document.createElement("div");
//       header.className = "domain-header";
//       header.textContent = domain;
//       header.onclick = () => content.classList.toggle("hidden");

//       const content = document.createElement("div");
//       content.className = "domain-content hidden";

//     const pages = document.createElement("div");
//     pages.innerHTML = "<strong>Visited Pages:</strong><ul>" +
//     (info.pages || []).map(page =>
//         `<li>${page.url}<br/><small>Last visited: ${new Date(page.lastVisited).toLocaleString()}</small></li>`
//     ).join("") +
//     "</ul>";

//       const cookies = document.createElement("div");
//       const cookieList = info.cookies || [];

//       cookies.innerHTML = "<strong>Cookies:</strong><ul>" +
//         cookieList.map(c => `<li>${c.name} = ${c.value}</li>`).join("") +
//         "</ul>";

//       content.appendChild(pages);
//       content.appendChild(cookies);

//       domainBlock.appendChild(header);
//       domainBlock.appendChild(content);
//       siteList.appendChild(domainBlock);
//     }
//   });
// });




document.addEventListener("DOMContentLoaded", () => {
  const siteList = document.getElementById("site-list");

  chrome.storage.local.get("visitedSites", (result) => {
    const visitedSites = result.visitedSites || {};
    siteList.innerHTML = "";

    if (Object.keys(visitedSites).length === 0) {
      siteList.textContent = "No data available.";
      return;
    }

    for (const [domain, info] of Object.entries(visitedSites)) {
      const domainBlock = document.createElement("div");
      domainBlock.className = "domain-block";

      const header = document.createElement("div");
      header.className = "domain-header";
      header.textContent = domain;

      const content = document.createElement("div");
      content.className = "domain-content hidden";

      header.addEventListener("click", () => {
        content.classList.toggle("hidden");
      });

      // Visited Pages Section
      const pagesWrapper = document.createElement("div");
      pagesWrapper.className = "sub-section";

      const pagesHeader = document.createElement("div");
      pagesHeader.className = "sub-header";
      pagesHeader.textContent = "▶ Visited Pages";

      const pagesContent = document.createElement("div");
      pagesContent.classList.add("hidden");

      pagesContent.innerHTML = "<ul>" +
        (info.pages || []).map(page =>
          `<li>${page.url}<br/><small>Last visited: ${new Date(page.lastVisited).toLocaleString()}</small></li>`
        ).join("") +
        "</ul>";

      pagesHeader.addEventListener("click", () => {
        pagesContent.classList.toggle("hidden");
        pagesHeader.textContent = pagesContent.classList.contains("hidden")
          ? "▶ Visited Pages"
          : "▼ Visited Pages";
      });

      pagesWrapper.appendChild(pagesHeader);
      pagesWrapper.appendChild(pagesContent);

      // Cookies Section
      const cookiesWrapper = document.createElement("div");
      cookiesWrapper.className = "sub-section";

      const cookiesHeader = document.createElement("div");
      cookiesHeader.className = "sub-header";
      cookiesHeader.textContent = "Cookies:";

      const cookiesContent = document.createElement("div");
      cookiesContent.innerHTML = "<ul>" +
        (info.cookies || []).map(c =>
          `<li>${c.name} = ${c.value}</li>`
        ).join("") +
        "</ul>";

      cookiesWrapper.appendChild(cookiesHeader);
      cookiesWrapper.appendChild(cookiesContent);

      content.appendChild(pagesWrapper);
      content.appendChild(cookiesWrapper);

      domainBlock.appendChild(header);
      domainBlock.appendChild(content);
      siteList.appendChild(domainBlock);
    }
  });
});

/******/ })()
;