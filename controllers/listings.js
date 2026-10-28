const express = require("express")
const router = express.Router()

const Listing = require("../models/listing.js")

// GET /listings
router.get("/", async (req, res) =>{
  try {
    const currentList = await Listing.find({}).populate("owner")
    res.render("listings/index.ejs", {
      listings: currentList
    })
  } catch(error) {
    console.log(error)
    res.redirect("/");
  }
})


// GET /listings/new
router.get("/new", async (req, res) => {
  res.render("listings/new.ejs");

});


// GET /listings/:listingId
/// method + path/endpoint + handler (async callback funtion)
router.get("/:listingId", async (req, res) => {
  try {
    const populatedListings = await Listing.findById(
      req.params.listingId,
    ).populate("owner");

    const userHasFavorited = populatedListings.favoritedByUsers.some((user) =>
      user.equals(req.session.user._id),
    );

    res.render("listings/show.ejs", {
      listing: populatedListings,
      userHasFavorited: userHasFavorited,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});


// GET /listings/:listingId/edit

router.get("/:listingId/edit", async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    res.render("listings/edit.ejs", {
      listing: currentListing,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});



// POST /listings
router.post("/", async (req, res) => {
  req.body.owner = req.session.user._id
  await Listing.create(req.body);
  res.redirect("/listings"); // redirect to index listings
})

// POST /listings/:listingId/favorited-by/:userId
router.post('/:listingId/favorited-by/:userId', async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $push: { favoritedByUsers: req.params.userId },
    }); 
    res.redirect(`/listings/${req.params.listingId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


// PUT /listings/:listingId
// controllers/listings.js

router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



// DELETE /listings/:listingId
router.delete("/:listingId", async (req, res) => {
  try {
    // const foundListing = await Listing.findByIdAndDelete(req.params.listingId)
    
    const foundListing = await Listing.findById(req.params.listingId);
    
    if (foundListing.owner.equals(req.session.user._id)) {
      await foundListing.deleteOne();
    } else {
      console.log("Permission denied");
    }
    
    res.redirect("/listings")
  } catch (error) {
    console.log(error)
    res.redirect("/listings")
  }
})


// controllers/listings.js
// DELETE /listings/:listingId/favorited-by/:userId
router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
  try {
    await Listing.findByIdAndUpdate(req.params.listingId, {
      $pull: { favoritedByUsers: req.params.userId },
    });
    res.redirect(`/listings/${req.params.listingId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;