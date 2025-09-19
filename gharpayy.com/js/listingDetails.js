const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get('id');

let images = [];  
const visibleImagesCount = 4; 
let currentIndex = 0; 
function openPopup(index) {
    currentIndex = index;
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popupImage");

    popupImage.src = images[currentIndex];
    popup.style.display = "flex";
}

function navigateImage(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    updatePopup();
}

function updatePopup() {
    const popupImage = document.getElementById("popupImage");
    popupImage.src = images[currentIndex];
}

function closePopup(event) {
    if (event.target.id === "popup") {
        document.getElementById("popup").style.display = "none";
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        navigateImage(-1);
    } else if (event.key === "ArrowRight") {
        navigateImage(1);
    }
});

let touchStartX = 0;
let touchEndX = 0;

document.getElementById("popup").addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.getElementById("popup").addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
        navigateImage(1);
    } else if (touchEndX - touchStartX > 50) {
        navigateImage(-1);
    }
});


function showAllImages() {
    openPopup(visibleImagesCount);
}

fetch(`https://gharpayy-backend.vercel.app/api/listings/${listingId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('listing-title').textContent = data.name + ", " + data.location;
        document.getElementById('room-type').textContent = "Gharpayy "+data.propType;

        const openingInfo = document.getElementById('opening-info');
        openingInfo.textContent = data.status === "open"
            ? "Available immediately"
            : `Opening in ${data.openDate}`;

        // Update Main Image
        document.getElementById('main-image').src = data.photos[0];
        images = data.photos;

        const gridContainer = document.querySelector(".grid-container");
        gridContainer.innerHTML = "";

        images.slice(1, visibleImagesCount).forEach((imgSrc, index) => {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = "Property Image";
            img.onclick = () => openPopup(index + 1);
            gridContainer.appendChild(img);
        });

        const extraImagesCount = images.length - visibleImagesCount;
        if (extraImagesCount > 0) {
            const moreImagesDiv = document.createElement("div");
            moreImagesDiv.classList.add("more-images");
            moreImagesDiv.onclick = () => showAllImages(); // FIXED

            const moreImg = document.createElement("img");
            moreImg.src = images[visibleImagesCount];
            moreImg.alt = "More Images";

            const overlay = document.createElement("div");
            overlay.classList.add("overlay");

            const overlayText = document.createElement("span");
            overlayText.textContent = `+${extraImagesCount}`;

            overlay.appendChild(overlayText);
            moreImagesDiv.appendChild(moreImg);
            moreImagesDiv.appendChild(overlay);

            gridContainer.appendChild(moreImagesDiv);
        }


        const amenities = data.amenities;
        updateAmenities(amenities);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


function updateAmenities(amenities) {
    // kitchen

    const kitchenEssentials = amenities.kitchenEssentials;
    const kitchenList = document.getElementById('kitchen-list');
    kitchenEssentials.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        kitchenList.appendChild(li);
    });

    // utilities

    const utilities = amenities.utilities;
    const utilitiesList = document.getElementById('utilities-list');
    utilities.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        utilitiesList.appendChild(li);
    });

    // Comfort
    const comfort = amenities.comfort;
    const comfortList = document.getElementById('comfort-list');
    comfort.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        comfortList.appendChild(li);
    });

    // Facilities
    const facilities = amenities.facilities;
    const facilitiesList = document.getElementById('facilities-list');
    facilities.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        facilitiesList.appendChild(li);
    });

    // Security
    const security = amenities.security;
    const securityList = document.getElementById('security-list');
    security.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        securityList.appendChild(li);
    });
}