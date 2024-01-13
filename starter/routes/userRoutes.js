const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// Update the Current User: New Password
router.patch('/updateMyPassword', authController.updatePassword);

// Adding a /me Endpoint //
router.get('/me', userController.getMe, userController.getUser);

// Update the Current User: Data
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

// Deleting the Current User //
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

// Implementing users part-2
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.UpdateUser)
  .delete(userController.deleteUser);

module.exports = router;
