document.addEventListener("DOMContentLoaded", () => {
  const siteList = document.getElementById("site-list");
  const searchInput = document.getElementById("search-input");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const pageInfo = document.getElementById("page-info");

  const PAGE_SIZE = 12;
  let visitedSites = {};
  let filteredHostnames = [];
  let currentPage = 1;

  chrome.storage.local.get("visitedSites", (result) => {
    visitedSites = result.visitedSites || {};
    filteredHostnames = Object.keys(visitedSites);
    render();
  });

  function render() {
    siteList.innerHTML = "";

    if (filteredHostnames.length === 0) {
      siteList.textContent = "No data available.";
      pageInfo.textContent = "";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const totalPages = Math.ceil(filteredHostnames.length / PAGE_SIZE);
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const hostnamesToRender = filteredHostnames.slice(start, end);

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    let index = start + 1;

    for (const hostname of hostnamesToRender) {
      const info = visitedSites[hostname];
      const firstPage = info.pages && info.pages.length > 0 ? info.pages[0] : null;

      const siteRow = document.createElement("div");
      siteRow.className = "site-row";

      const serial = document.createElement("div");
      serial.className = "serial";
      serial.textContent = `${index++}.`;

      const titleSpan = document.createElement("div");
      titleSpan.className = "site-title";
      titleSpan.textContent = hostname;

      const link = document.createElement("a");
      link.href = `https://${hostname}`;
      link.textContent = "Link";
      link.className = "site-link";
      link.target = "_blank";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "toggle-btn";
      toggleBtn.textContent = "+";

      siteRow.appendChild(serial);
      siteRow.appendChild(titleSpan);
      siteRow.appendChild(link);
      siteRow.appendChild(toggleBtn);
      siteList.appendChild(siteRow);

      // Cookie Table
      const table = document.createElement("table");
      table.className = "cookie-table hidden";

      const thead = `
        <thead>
          <tr>
            <th>#</th>
            <th>Cookie Name</th>
            <th>Cookie Domain</th>
            <th>Party</th>
            <th>Expiry Date</th>
            <th>Description</th>
            <th>Value</th>
          </tr>
        </thead>`;
      const tbody = document.createElement("tbody");

      (info.cookies || []).forEach((cookie, i) => {
        const expires = cookie.expirationDate
          ? new Date(cookie.expirationDate * 1000).toLocaleString()
          : "Session";

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${cookie.name}</td>
          <td>${cookie.domain}</td>
          <td>${cookie.party || "unknown"}</td>
          <td>${expires}</td>
          <td>Default description</td>
        `;

        const valueCell = document.createElement("td");
        const previewSpan = document.createElement("span");
        previewSpan.className = "cookie-value";
        previewSpan.title = cookie.value;
        previewSpan.textContent =
          cookie.value.length > 30 ? cookie.value.slice(0, 30) + "…" : cookie.value;

        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn";
        copyBtn.textContent = "Copy";
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(cookie.value).then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
          });
        });

        valueCell.appendChild(previewSpan);
        valueCell.appendChild(copyBtn);
        row.appendChild(valueCell);

        tbody.appendChild(row);
      });

      table.innerHTML = thead;
      table.appendChild(tbody);
      siteList.appendChild(table);

      toggleBtn.addEventListener("click", () => {
        const isHidden = table.classList.toggle("hidden");
        toggleBtn.textContent = isHidden ? "+" : "−";
      });
    }
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    filteredHostnames = Object.keys(visitedSites).filter(host =>
      host.toLowerCase().includes(query)
    );
    currentPage = 1;
    render();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredHostnames.length / PAGE_SIZE);
    if (currentPage < totalPages) {
      currentPage++;
      render();
    }
  });
});
