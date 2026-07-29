const Listing = require("../models/listing");
const axios = require("axios");
const MAP_TOKEN = process.env.MAP_TOKEN;

// INDEX
module.exports.index = async (req , res) => {
    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, category });
};

// NEW FORM
module.exports.renderNewForm = (req , res) => {
    res.render("listings/new");
};

// SHOW
module.exports.showListing = async (req , res) => {
    let {id} = req.params;

    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");

    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");   
    }

    res.render("listings/show.ejs", { listing });
};

// CREATE (MULTIPLE IMAGES FIXED)
module.exports.createListing = async (req , res , next) => {


    let response = await axios.get("https://us1.locationiq.com/v1/search.php", {
        params: {
            key: MAP_TOKEN,
            q: req.body.listing.location,
            format: "json"
        }
    });

    if (!response.data || response.data.length === 0) {
        throw new Error("Invalid location");
    }

    let lat = parseFloat(response.data[0].lat);
    let lng = parseFloat(response.data[0].lon);

    const newListing = new Listing(req.body.listing);

    newListing.geometry = {
        type: "Point",
        coordinates: [lng, lat]
    };

    // ✅ MULTIPLE IMAGES
    const images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    newListing.images = images;

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req , res) => {
    let {id} = req.params;

    const listing = await Listing.findById(id);

    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");   
    }

    let originalImageUrl = listing.images[0]?.url;
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE (MULTIPLE IMAGES FIXED)
module.exports.updateListing = async (req, res) => {

    

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.files && req.files.length > 0) {
        const images = req.files.map(f => ({
            url: f.path,
            filename: f.filename
        }));

        listing.images = images;
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
    let{ id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};