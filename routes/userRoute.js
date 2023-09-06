const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator
} = require('../utils/validators/userValidator');

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changeUserPassword
  } = require('../services/userService');
  
  const authService = require('../services/authService');

  const router = express.Router();

  router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword)
  router
  .route('/')
  .get(authService.protect, authService.allowedTo('admin', 'manager'), getUsers)
  .post(authService.protect, authService.allowedTo('admin'), uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(authService.protect, authService.allowedTo('admin'), getUserValidator, getUser)
  .put(authService.protect, authService.allowedTo('admin'), uploadUserImage, updateUserValidator, resizeImage, updateUser)
  .delete(authService.protect, authService.allowedTo('admin'), deleteUserValidator, deleteUser);


  module.exports = router;