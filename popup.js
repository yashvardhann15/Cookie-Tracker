// document.addEventListener("DOMContentLoaded", () => {
//   const siteList = document.getElementById("site-list");

//   chrome.storage.local.get("visitedSites", (result) => {
//     const visitedSites = result.visitedSites || {};
//     siteList.innerHTML = "";

//     if (Object.keys(visitedSites).length === 0) {
//       siteList.textContent = "No data available.";
//       return;
//     }

//     let index = 1;

//     for (const [hostname, info] of Object.entries(visitedSites)) {
//       const firstPage = info.pages && info.pages.length > 0 ? info.pages[0] : null;
//       const url = firstPage?.url || "#";

//       // Site Row
//       const siteRow = document.createElement("div");
//       siteRow.className = "site-row";

//       const siteInfo = document.createElement("div");
//       siteInfo.className = "site-info";

//       const serial = document.createElement("span");
//       serial.textContent = `${index++}.`;

//       const titleSpan = document.createElement("span");
//       titleSpan.className = "site-title";
//       titleSpan.textContent = hostname;

//       const link = document.createElement("a");
//       link.href = `https://${hostname}`;
//       link.textContent = "Link";
//       link.className = "site-link";
//       link.target = "_blank";

//       const toggleBtn = document.createElement("button");
//       toggleBtn.className = "toggle-btn";
//       toggleBtn.textContent = "+"; // Initial state

//       siteInfo.appendChild(serial);
//       siteInfo.appendChild(titleSpan);
//       siteInfo.appendChild(link);

//       siteRow.appendChild(siteInfo);
//       siteRow.appendChild(toggleBtn);
//       siteList.appendChild(siteRow);

//       // Cookie Table
//       const table = document.createElement("table");
//       table.className = "cookie-table hidden";

//       const thead = `
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Cookie Name</th>
//             <th>Cookie Domain</th>
//             <th>Expiry Date</th>
//             <th>Description</th>
//             <th>Value</th>
//           </tr>
//         </thead>`;
//       const tbody = document.createElement("tbody");

//       (info.cookies || []).forEach((cookie, i) => {
//         const expires = cookie.expirationDate
//           ? new Date(cookie.expirationDate * 1000).toLocaleString()
//           : "Session";

//         const row = document.createElement("tr");

//         row.innerHTML = `
//           <td>${i + 1}</td>
//           <td>${cookie.name}</td>
//           <td>${cookie.domain}</td>
//           <td>${expires}</td>
//           <td>Default description</td>
//         `;

//         const valueCell = document.createElement("td");
//         const previewSpan = document.createElement("span");
//         previewSpan.className = "cookie-value";
//         previewSpan.title = cookie.value;
//         previewSpan.textContent =
//           cookie.value.length > 30 ? cookie.value.slice(0, 30) + "…" : cookie.value;

//         const copyBtn = document.createElement("button");
//         copyBtn.className = "copy-btn";
//         copyBtn.textContent = "Copy";
//         copyBtn.addEventListener("click", () => {
//           navigator.clipboard.writeText(cookie.value).then(() => {
//             copyBtn.textContent = "Copied!";
//             setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
//           });
//         });

//         valueCell.appendChild(previewSpan);
//         valueCell.appendChild(copyBtn);
//         row.appendChild(valueCell);

//         tbody.appendChild(row);
//       });

//       table.innerHTML = thead;
//       table.appendChild(tbody);
//       siteList.appendChild(table);

//       // Toggle logic
//       toggleBtn.addEventListener("click", () => {
//         const isHidden = table.classList.toggle("hidden");
//         toggleBtn.textContent = isHidden ? "+" : "−";
//       });
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

    let index = 1;

    for (const [hostname, info] of Object.entries(visitedSites)) {
      const firstPage = info.pages && info.pages.length > 0 ? info.pages[0] : null;
      const url = firstPage?.url || "#";

      // Site Row
      const siteRow = document.createElement("div");
      siteRow.className = "site-row";

      const siteInfo = document.createElement("div");
      siteInfo.className = "site-info";

      const serial = document.createElement("span");
      serial.textContent = `${index++}.`;

      const titleSpan = document.createElement("span");
      titleSpan.className = "site-title";
      titleSpan.textContent = hostname;

      const link = document.createElement("a");
      link.href = `https://${hostname}`;
      link.textContent = "Link";
      link.className = "site-link";
      link.target = "_blank";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "toggle-btn";
      toggleBtn.textContent = "+"; // Initial state

      siteInfo.appendChild(serial);
      siteInfo.appendChild(titleSpan);
      siteInfo.appendChild(link);

      siteRow.appendChild(siteInfo);
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

      // Toggle logic
      toggleBtn.addEventListener("click", () => {
        const isHidden = table.classList.toggle("hidden");
        toggleBtn.textContent = isHidden ? "+" : "−";
      });
    }
  });
});
