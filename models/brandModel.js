const mongoose = require('mongoose');
// 1- Create Schema
const brandSchema  = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "too short"],
    maxlength: [32, "too long"],
  },
  // ex: A and B => shoping.com/a-and-b
  slug: {
    type: String,
    lowercase: true,
  },
  image: String,
},
// mongo options
{ timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
brandSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
brandSchema.post('save', (doc) => {
  setImageURL(doc);
});

// 2- Create model
const BrandModel = mongoose.model('Brand', brandSchema );

module.exports = BrandModel;
