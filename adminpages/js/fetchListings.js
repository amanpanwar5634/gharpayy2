let curr = 1;
let totalPages = 1;
let searchQuery = "";
  
function applyFilters() {
  fetchListings(1); 
}

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("keyup", handleSearch);
  fetchListings(1);
});

async function fetchListings(page = 1) {
  const apiEndpoint = "https://gharpayy-backend.vercel.app/api/listings";
  curr = page;
  const gender = document.getElementById("genderFilter").value;
  const status = document.getElementById("statusFilter").value;
  const propType = document.getElementById("propTypeFilter").value;
  const url = `${apiEndpoint}?page=${page}&limit=10&search=${searchQuery}&gender=${gender}&status=${status}&propType=${propType}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    totalPages = data.totalPages;
    renderTable(data.listings);
    renderPagination(data.totalListings);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("table-body").innerHTML =
      "<tr><td colspan='8' class='text-center p-3'>Failed to load data</td></tr>";
  }
}

function renderTable(listings) {
  const tableBody = document.getElementById("table-body");
  if (!tableBody) {
    console.error("table-body element not found");
    return;
  }
  tableBody.innerHTML = "";

  listings.forEach((listing, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th class="p-3">#${index + 1}</th>
      <td class="p-3"><span class="ms-2">${listing.name}</span></td>
      <td class="text-center p-3">${listing.gender}</td>
      <td class="text-center p-3">${listing.location}</td>
      <td class="text-center p-3">${listing.propType}</td>
      <td class="text-center p-3">
        <div class="badge ${listing.status === "open" ? "bg-soft-success" : "bg-soft-danger"} rounded px-3 py-1">
          ${listing.status === "open" ? "Open" : "Not Open"}
        </div>
      </td>
      <td class="text-center p-3">${listing.openDate}</td>
      <td class="text-end p-3">
        <button class="btn btn-sm btn-primary view-btn" data-id="${listing._id}">View</button>
        <button data-id="${listing._id}" class="btn btn-sm ${listing.disabled ? "btn-success enable-btn" : "btn-danger disable-btn"} ms-2">
          ${listing.disabled ? "Enable" : "Disable"}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const listingId = event.target.getAttribute("data-id");
      window.location.href = `https://gharpayy-backend.vercel.app/invoice.html?id=${listingId}`;
    });
  });

  document.querySelectorAll(".disable-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const listingId = event.target.getAttribute("data-id");
      await updateListingStatus(listingId, "disable");
    });
  });

  document.querySelectorAll(".enable-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const listingId = event.target.getAttribute("data-id");
      await updateListingStatus(listingId, "enable");
    });
  });
}

function renderPagination(totalListings) {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    paginationElement.innerHTML += `
      <li class="page-item ${i === curr ? 'active' : ''}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }

  document.getElementById("pagination-info").innerText =
    `Showing ${(curr - 1) * 10 + 1} - ${Math.min(curr * 10, totalListings)} out of ${totalListings || 1}`;
}

async function changePage(page) {
  curr = page;
  await fetchListings(curr);
}

function handleSearch() {
  searchQuery = document.getElementById("searchInput").value;
  fetchListings(1);
}

async function updateListingStatus(listingId, action) {
  try {
    const response = await fetch(`https://gharpayy-backend.vercel.app/api/listings/${listingId}/${action}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      fetchListings(curr);
    } else {
      const error = await response.json();
      alert(error.message || `Failed to ${action} the listing.`);
    }
  } catch (err) {
    console.error(`Error ${action} listing:`, err);
    alert(`An error occurred while ${action} the listing.`);
  }
}