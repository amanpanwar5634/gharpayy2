async function fetchListingStats() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/admin';
      return;
    }
    const response = await fetch('/api/listings/stats',
      {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );
    const data = await response.json();

    document.getElementById('totalListings').textContent = data.totalListings;
    document.getElementById('totalEnabledListings').textContent = data.totalEnabledListings;
    document.getElementById('totalAvailableNow').textContent = data.totalAvailableNow;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



document.addEventListener("DOMContentLoaded", async () => {
  fetchListingStats()
  const apiEndpoint = "https://gharpayy-backend.vercel.app/api/listings/enabled";
  const tableBody = document.getElementById("table-body");

  try {
    const response = await fetch(apiEndpoint);
    const listings = await response.json();

    tableBody.innerHTML = "";

    listings.forEach((listing, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
  <th class="p-3">#${index + 1}</th>
  <td class="p-3">
    <span class="ms-2">${listing.name}</span>
  </td>
  <td class="text-center p-3">${listing.gender}</td>
  <td class="text-center p-3">${listing.location}</td>
  <td class="text-center p-3">${listing.propType}</td>
  <td class="text-center p-3">
    <div class="badge ${listing.status === "open" ? "bg-soft-success" : "bg-soft-danger"
        } rounded px-3 py-1">
      ${listing.status === "open" ? "Open" : "Not Open"}
    </div>
  </td>
  <td class="text-center p-3">${listing.openDate}</td>
  <td class="text-end p-3">
    <button class="btn btn-sm btn-primary view-btn" data-id="${listing._id}">View</button>
    <button data-id="${listing._id}" 
            class="btn btn-sm ${listing.disabled ? "btn-success enable-btn" : "btn-danger disable-btn"} ms-2">
      ${listing.disabled ? "Enable" : "Disable"}
    </button>
</td>

`;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    tableBody.innerHTML =
      "<tr><td colspan='8' class='text-center p-3'>Failed to load data</td></tr>";
  }

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const listingId = event.target.getAttribute("data-id");
      window.location.href = `https://gharpayy-backend.vercel.app/invoice.html?id=${listingId}`;
    });
  });

  document.querySelectorAll(".disable-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const listingId = event.target.getAttribute("data-id");

      try {
        const response = await fetch(`https://gharpayy-backend.vercel.app/api/listings/${listingId}/disable`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();

          btn.classList.remove("btn-danger");
          btn.classList.add("btn-success");
          btn.textContent = "Enable";
          btn.disabled = true;
        } else {
          const error = await response.json();
          alert(error.message || "Failed to disable the listing.");
        }
      } catch (err) {
        console.error("Error disabling listing:", err);
        alert("An error occurred while disabling the listing.");
      }
    });
  });

  document.querySelectorAll(".enable-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const listingId = event.target.getAttribute("data-id");

      try {

        const response = await fetch(`https://gharpayy-backend.vercel.app/api/listings/${listingId}/enable`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();

          btn.classList.remove("btn-success");
          btn.classList.add("btn-danger");
          btn.textContent = "Disable";
          btn.disabled = false;

          console.log(result.message || "Listing enabled successfully!");
        } else {
          const error = await response.json();
          alert(error.message || "Failed to enable the listing.");
        }
      } catch (err) {
        console.error("Error enabling listing:", err);
        alert("An error occurred while enabling the listing.");
      }
    });
  });


});

