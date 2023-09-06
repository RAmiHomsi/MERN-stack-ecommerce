const mongoose = require('mongoose');
// 1- Create Schema
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, "it must be unique"],
    minlength: [2, "too short"],
    maxlength: [32, "too long"],
  },
  // ex: A and B => shoping.com/a-and-b
  slug: {
    type: String,
    lowercase: true,
  },
  category:{
    type: mongoose.Schema.ObjectId,
    ref:"Category",
    required: true,
  }
},
// mongo options
{ timestamps: true }
);

// 2- Create model
const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;
