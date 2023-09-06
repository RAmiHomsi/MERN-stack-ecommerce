const CategoryModel = require('../models/categoryModel');
const factory = require('./handlersFactory');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');


/*const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/categories');
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
      cb(null, filename);
    }
  });*/

// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file){
    await sharp(req.file.buffer).resize(600, 600).toFormat("jpeg").jpeg({ quality: 95 }).toFile(`uploads/categories${fileName}`);
  // Save image into our db
  req.body.image = fileName;
  }
  next();
});

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

// Build query
exports.getCategories = factory.getAll(CategoryModel);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private Admin-mananger
exports.createCategory = factory.createOne(CategoryModel);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private Admin-mananger
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private Admin
exports.deleteCategory = factory.deleteOne(CategoryModel);