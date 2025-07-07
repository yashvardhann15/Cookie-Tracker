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

      // Pages section
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

      // Cookies section
      const cookiesWrapper = document.createElement("div");
      cookiesWrapper.className = "sub-section";
      const cookiesHeader = document.createElement("div");
      cookiesHeader.className = "sub-header";
      cookiesHeader.textContent = "Cookies:";

      const cookiesContent = document.createElement("div");
      const cookies = info.cookies || [];

      if (cookies.length === 0) {
        cookiesContent.innerHTML = "<p>No cookies found.</p>";
      } else {
        const table = document.createElement("table");
        table.className = "cookie-table";

        const thead = document.createElement("thead");
        thead.innerHTML = `
          <tr>
            <th>Cookie Name</th>
            <th>Domain</th>
            <th>Expiry Date</th>
            <th>Description</th>
            <th>Value</th>
          </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        cookies.forEach((c) => {
          const tr = document.createElement("tr");
          const expiry = c.expirationDate
            ? new Date(c.expirationDate * 1000).toLocaleString()
            : "Session";

          const safeValue = (c.value || "").length > 30
            ? `${c.value.slice(0, 30)}...`
            : c.value;

          tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.domain}</td>
            <td>${expiry}</td>
            <td><i>Not classified</i></td>
            <td title="${c.value}">${safeValue}</td>
          `;
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        cookiesContent.innerHTML = "";
        cookiesContent.appendChild(table);
      }

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
