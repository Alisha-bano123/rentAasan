const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    images:[ {
        url: String,
        filename: String
    // filename: {
    //     type: String,
    //     default: "default-image"
    // },
    // url: {
    //     type: String,
    //     default: "https://media.istockphoto.com/id/503044702/photo/illuminated-sky-and-outside-of-waterfront-buiding.jpg?s=2048x2048&w=is&k=20&c=QAssSmAYUlEzWcs8691KIk_568axAFULXRzPUuQPRdw=",
    //     set: (v) => v === "" ? "https://media.istockphoto.com/id/503044702/photo/illuminated-sky-and-outside-of-waterfront-buiding.jpg?s=2048x2048&w=is&k=20&c=QAssSmAYUlEzWcs8691KIk_568axAFULXRzPUuQPRdw=" : v
    // }
}],
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ], 
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
       type: {
          type: String,
          enum: ['Point'],
          required: true
  },
    coordinates: {
        type: [Number],
        required: true
  }
}   
   

});

listingSchema.post("findOneAndDelete", async (listing) => {
   if(listing){ 
    await Review.deleteMany({_id: {$in: listing.reviews}});
}
    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;