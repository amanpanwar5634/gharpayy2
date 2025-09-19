const Listing = require('../models/Listing');

const addListing = async (req, res) => {
  try {
    const {
      name,
      location,
      gender,
      propType,
      status,
      openDate,
      amenities,
      photos,
      description
    } = req.body;

    const newListing = new Listing({
      name,
      location,
      gender,
      propType,
      status,
      openDate: status === 'not_open' ? openDate : 'NA',
      amenities,
      photos,
      description
    });

    await newListing.save();
    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      message: 'Error creating listing',
      error: error.message || 'Unknown error',
    });
  }
};

// Controller for fetching all listings
// const getAllListings = async (req, res) => {
//   try {
    
//     const listings = await Listing.find();
//     res.status(200).json(listings);
//   } catch (error) {
//     console.error('Error fetching listings:', error);
//     res.status(500).json({
//       message: 'Error fetching listings',
//       error: error.message || 'Unknown error',
//     });
//   }
// };

const getAllListings = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", gender, status, propType, location } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // Search by name or location (case insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, 
        { location: { $regex: search, $options: "i" } }
      ];
    }

    // Apply filters if provided
    if (gender) query.gender = gender;
    if (status) query.status = status;
    if (propType) query.propType = propType;
    if (location) query.location = location;

    const totalListings = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      totalPages: Math.ceil(totalListings / limit),
      currentPage: page,
      totalListings,
      listings
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      message: "Error fetching listings",
      error: error.message || "Unknown error",
    });
  }
};


const editListing = async (req, res) => {  
  try {
    
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({
      message: "Error fetching listing",
      error: error.message || "Unknown error",
    });
  }
};


const updateListing = async (req, res) => {
  try {
    const {
      name,
      location,
      gender,
      propType,
      status,
      openDate,
      amenities,
      photos,
      description
    } = req.body;

    const updatedFields = {
      name,
      location,
      gender,
      propType,
      status,
      openDate: status === 'not_open' ? openDate : 'NA',
      amenities,
      photos,
      description
    };

   
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,             
      updatedFields,            
      { new: true, runValidators: true } 
    );

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing updated successfully', listing: updatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      message: 'Error updating listing',
      error: error.message || 'Unknown error',
    });
  }
};

const disableListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.disabled = "true"; 
    await listing.save();

    res.status(200).json({ message: "Listing has been disabled successfully", listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while disabling the listing", error });
  }
};

const enableListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.disabled = "false"; 
    await listing.save();

    res.status(200).json({ message: "Listing has been enabled successfully", listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while enabling the listing", error });
  }
};

const getEnabledListings = async (req, res) => {
  try { 
    
    const listings = await Listing.find({ disabled: false });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      message: 'Error fetching listings',
      error: error.message || 'Unknown error',
    });
  }
};



const getStats = async (req, res) => {
    try {
        const totalListings = await Listing.countDocuments();
        const totalEnabledListings = await Listing.countDocuments({ disabled: false });
        const totalAvailableNow = await Listing.countDocuments({ status: 'open' });

        res.json({
            totalListings,
            totalEnabledListings,
            totalAvailableNow
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
  addListing,
  getAllListings,
  editListing,
  updateListing,
  disableListing,
  enableListing,
  getEnabledListings,
  getStats,
};
