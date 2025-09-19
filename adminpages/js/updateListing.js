const uploadedPhotosContainer = document.getElementById('uploadedPhotos');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const listingPhotoInput = document.getElementById('listingPhoto');

let uploadedPhotos = [];

function handleDeleteImage(e, photoPath, div) {
  e.stopPropagation();

  fetch(`https://gharpayy-backend.vercel.app/api/listings/delete-photo`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photoPath })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        div.remove();

        uploadedPhotos = uploadedPhotos.filter(path => path !== photoPath);
        
      } else {
        console.error('Failed to delete the photo from server');
      }
    })
    .catch(error => {
      console.error('Error deleting the photo:', error);
    });
}

function updatePhotoPreview(photoPath) {
  const div = document.createElement('div');
  div.classList.add('img-thumbnail');

  const img = document.createElement('img');
  img.src = `https://gharpayy-backend.vercel.app${photoPath}`;
  img.alt = 'Uploaded Photo';

  div.appendChild(img);

  const closeButton = document.createElement('span');
  closeButton.classList.add('close-button');
  closeButton.textContent = 'x';

  closeButton.addEventListener('click', (e) => {
    handleDeleteImage(e, photoPath, div); 
  });

  div.appendChild(closeButton);
  uploadedPhotosContainer.appendChild(div);
}


uploadPhotoBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const photoFile = listingPhotoInput.files[0];

  if (!photoFile) {
    alert('Please select a photo to upload');
    return;
  }

  const formData = new FormData();
  formData.append('photo', photoFile);

  try {
    const response = await fetch('https://gharpayy-backend.vercel.app/api/listings/upload-photo', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      uploadedPhotos.push(data.photoPath);
      updatePhotoPreview(data.photoPath);
      listingPhotoInput.value = '';
    } else {
      alert('Failed to upload photo');
    }
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  if (!listingId) {
    alert("No listing ID found");
    return;
  }

  try {
    const response = await fetch(`https://gharpayy-backend.vercel.app/api/listings/${listingId}`);
    const listing = await response.json(); 

    document.getElementById("listingName").value = listing.name;
    document.getElementById("listingLocation").value = listing.location;
    document.getElementById("listingGender").value = listing.gender;
    document.getElementById("listingType").value = listing.propType.toUpperCase();
    document.getElementById("listingStatus").value = listing.status;
    if (listing.openDate != "NA") {

      document.getElementById("openingDate").value = listing.openDate;
    } else {
      document.getElementById("openingDateGroup").style.display = 'none';
    }

    document.getElementById("listingDescription").value = listing.description;

    const amenities = listing.amenities || {};

    if (amenities.kitchenEssentials) {
      document.getElementById("amenityMicrowave").checked = amenities.kitchenEssentials.includes("Microwave");
      document.getElementById("amenityRefrigerator").checked = amenities.kitchenEssentials.includes("Refrigerator");
    }

    if (amenities.utilities) {
      document.getElementById("amenityWifi").checked = amenities.utilities.includes("WiFi");
      document.getElementById("amenityElectricity").checked = amenities.utilities.includes("Electricity Bill");
      document.getElementById("amenityWater").checked = amenities.utilities.includes("Water Bill");
    }

    if (amenities.comfort) {
      document.getElementById("amenityGeyser").checked = amenities.comfort.includes("Geyser Hot Water");
      document.getElementById("amenityWardrobe").checked = amenities.comfort.includes("Wooden Wardrobe");
      document.getElementById("amenityCot").checked = amenities.comfort.includes("Wooden Cot and Mattress");
    }

    if (amenities.facilities) {
      document.getElementById("amenityHousekeeping").checked = amenities.facilities.includes("Professional Housekeeping");
      document.getElementById("amenityWashingMachine").checked = amenities.facilities.includes("Automatic Washing Machine");
    }

    if (amenities.security) {
      document.getElementById("amenityCCTV").checked = amenities.security.includes("CCTV");
      document.getElementById("amenityRFID").checked = amenities.security.includes("RFID Glasses");
    }

    uploadedPhotos = listing.photos;
    uploadedPhotos.forEach(photoPath => {
      updatePhotoPreview(photoPath);
    });

  } catch (error) {
    console.error("Error fetching listing:", error);
  }

  document.getElementById("saveButton").addEventListener("click", async (event) => {
    event.preventDefault();
    const updatedAmenities = {
      kitchenEssentials: [],
      utilities: [],
      comfort: [],
      facilities: [],
      security: [],
    };

    if (document.getElementById("amenityMicrowave").checked) {
      updatedAmenities.kitchenEssentials.push("Microwave");
    }
    if (document.getElementById("amenityRefrigerator").checked) {
      updatedAmenities.kitchenEssentials.push("Refrigerator");
    }
    if (document.getElementById("amenityWifi").checked) {
      updatedAmenities.utilities.push("WiFi");
    }
    if (document.getElementById("amenityElectricity").checked) {
      updatedAmenities.utilities.push("Electricity Bill");
    }
    if (document.getElementById("amenityWater").checked) {
      updatedAmenities.utilities.push("Water Bill");
    }
    if (document.getElementById("amenityGeyser").checked) {
      updatedAmenities.comfort.push("Geyser Hot Water");
    }
    if (document.getElementById("amenityWardrobe").checked) {
      updatedAmenities.comfort.push("Wooden Wardrobe");
    }
    if (document.getElementById("amenityCot").checked) {
      updatedAmenities.comfort.push("Wooden Cot and Mattress");
    }
    if (document.getElementById("amenityHousekeeping").checked) {
      updatedAmenities.facilities.push("Professional Housekeeping");
    }
    if (document.getElementById("amenityWashingMachine").checked) {
      updatedAmenities.facilities.push("Automatic Washing Machine");
    }
    if (document.getElementById("amenityCCTV").checked) {
      updatedAmenities.security.push("CCTV");
    }
    if (document.getElementById("amenityRFID").checked) {
      updatedAmenities.security.push("RFID Glasses");
    }

    const updatedListing = {
      name: document.getElementById("listingName").value,
      location: document.getElementById("listingLocation").value,
      gender: document.getElementById("listingGender").value,
      propType: document.getElementById("listingType").value,
      status: document.getElementById("listingStatus").value,
      openDate: document.getElementById("openingDate").value,
      amenities: updatedAmenities,
      photos: uploadedPhotos,
      description: document.getElementById("listingDescription").value,
    };

    try {
      const response = await fetch(`https://gharpayy-backend.vercel.app/api/listings/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedListing),
      });

      if (response.ok) {
        alert("Listing updated successfully!");
        console.log(await response.json());
        loadProtectedPage('allListings');
      } else {
        console.error("Error updating listing:", response.statusText);
        alert("Failed to update listing.");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  });
});


function loadProtectedPage('allListings'){
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/admin"; 
    return;
  }

  fetch("/allListings", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Unauthorized");
      return response.text();
    })
    .then((html) => {
      document.open();
      document.write(html);
      document.close();
    })
    .catch(() => {
      localStorage.removeItem("token"); 
      localStorage.removeItem("userId");
      window.location.href = "/admin"; 
    });
};