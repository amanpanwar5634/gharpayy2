const uploadedPhotosContainer = document.getElementById('uploadedPhotos');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const listingPhotoInput = document.getElementById('listingPhoto');
const addListingForm = document.getElementById('addListingForm');
const saveButton = document.getElementById('saveButton');

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

const updateAmenities = () => {
    amenities = {
        kitchenEssentials: [],
        utilities: [],
        comfort: [],
        facilities: [],
        security: [],
        additional: [],
    };

    if (document.getElementById('amenityMicrowave').checked) {
        amenities.kitchenEssentials.push('Microwave');
    }
    if (document.getElementById('amenityRefrigerator').checked) {
        amenities.kitchenEssentials.push('Refrigerator');
    }
    if (document.getElementById('amenityWifi').checked) {
        amenities.utilities.push('WiFi');
    }
    if (document.getElementById('amenityElectricity').checked) {
        amenities.utilities.push('Electricity Bill');
    }
    if (document.getElementById('amenityWater').checked) {
        amenities.utilities.push('Water Bill');
    }
    if (document.getElementById('amenityGeyser').checked) {
        amenities.comfort.push('Geyser Hot Water');
    }
    if (document.getElementById('amenityWardrobe').checked) {
        amenities.comfort.push('Wooden Wardrobe');
    }
    if (document.getElementById('amenityCot').checked) {
        amenities.comfort.push('Wooden Cot and Mattress');
    }
    if (document.getElementById('amenityHousekeeping').checked) {
        amenities.facilities.push('Professional Housekeeping');
    }
    if (document.getElementById('amenityWashingMachine').checked) {
        amenities.facilities.push('Automatic Washing Machine');
    }
    if (document.getElementById('amenityCCTV').checked) {
        amenities.security.push('CCTV');
    }
    if (document.getElementById('amenityRFID').checked) {
        amenities.security.push('RFID Glasses');
    }

};

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
            return false;
        } else {
            alert('Failed to upload photo');
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
    }
});

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


saveButton.addEventListener('click', async (e) => {
    e.preventDefault();

    updateAmenities();

    const formData = {
        name: document.getElementById('listingName').value,
        location: document.getElementById('listingLocation').value,
        gender: document.getElementById('listingGender').value,
        propType: document.getElementById('listingType').value,
        status: document.getElementById('listingStatus').value,
        openDate: document.getElementById('openingDate').value,
        amenities: amenities,
        photos: uploadedPhotos,
        description: document.getElementById('listingDescription').value,
    };


    if (!formData.name || !formData.location || uploadedPhotos.length === 0) {
        alert('Please fill in all required fields and upload at least one photo');
        return;
    }

    try {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/admin';
            return;
        }

        const response = await fetch('https://gharpayy-backend.vercel.app/api/listings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Listing created successfully');
            addListingForm.reset();
            uploadedPhotosContainer.innerHTML = '';
            uploadedPhotos = [];
        } else {
            alert('Failed to save listing');
        }
    } catch (error) {
        console.error('Error saving listing:', error);
    }
});
