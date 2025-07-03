
// document.addEventListener("DOMContentLoaded", () => {
//   const siteList = document.getElementById("site-list");
//     console.log("Loading popup...");
//     chrome.storage.local.get("visitedSites", (data) => {
//   console.log("Visited Sites in popup:", data);
// });
//   chrome.storage.local.get("visitedSites", (data) => {
//     const visitedSites = data.visitedSites || {};

//     if (Object.keys(visitedSites).length === 0) {
//       siteList.innerText = "No sites visited yet.";
//       return;
//     }

//     for (const [domain, info] of Object.entries(visitedSites)) {
//       const domainBlock = document.createElement("div");
//       domainBlock.className = "domain-block";

//       const header = document.createElement("div");
//       header.className = "domain-header";
//       header.textContent = domain;
//       header.onclick = () => {
//         content.classList.toggle("hidden");
//       };

//       const content = document.createElement("div");
//       content.className = "domain-content hidden";

//       const pages = document.createElement("div");
//       pages.innerHTML = "<strong>Visited Pages:</strong><ul>" +
//         info.pages.map(url => `<li>${url}</li>`).join("") +
//         "</ul>";

//       const cookies = document.createElement("div");
//       cookies.innerHTML = "<strong>Cookies:</strong><ul>" +
//         (info.cookies || []).map(c => `<li>${c.name} = ${c.value}</li>`).join("") +
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

  chrome.storage.local.get("visitedSites", (data) => {
    console.log("Visited Sites in popup:", data);

    const visitedSites = data.visitedSites || {};

    siteList.innerHTML = ""; // clear "Loading..."

    if (Object.keys(visitedSites).length === 0) {
      siteList.innerText = "No sites visited yet.";
      return;
    }

    const sortedDomains = Object.keys(visitedSites).sort();

    for (const domain of sortedDomains) {
      const info = visitedSites[domain];

      const domainBlock = document.createElement("div");
      domainBlock.className = "domain-block";

      const header = document.createElement("div");
      header.className = "domain-header";
      header.textContent = domain;
      header.onclick = () => content.classList.toggle("hidden");

      const content = document.createElement("div");
      content.className = "domain-content hidden";

      const pages = document.createElement("div");
      pages.innerHTML = "<strong>Visited Pages:</strong><ul>" +
        (info.pages || []).map(url => `<li>${url}</li>`).join("") +
        "</ul>";

      const cookies = document.createElement("div");
      const cookieList = info.cookies || [];

      if (cookieList.length === 0) {
        cookies.innerHTML = "<strong>Cookies:</strong><p><em>No accessible cookies.</em></p>";
      } else {
        cookies.innerHTML = "<strong>Cookies:</strong><ul>" +
          cookieList.map(c => `<li>${c.name} = ${c.value}</li>`).join("") +
          "</ul>";
      }

      content.appendChild(pages);
      content.appendChild(cookies);

      domainBlock.appendChild(header);
      domainBlock.appendChild(content);
      siteList.appendChild(domainBlock);
    }
  });
});
