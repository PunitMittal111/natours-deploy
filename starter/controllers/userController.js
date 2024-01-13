const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utiles/catchAsync');
const AppError = require('../utiles/appError');
const factory = require('./handlerFactory');
// Sharp install and these three tools are also install then will working
// npm install --include=optional sharp
// npm install --os=win32 --cpu=x64 sharp
//  npm install --force @img/sharp-win32-x64

// // Configuring Multer //
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb = callBack
//     cb(null, 'starter/public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-7464464abc783dfd-245646146.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Image Uploads Using Multer: Users //
exports.uploadUserPhoto = upload.single('photo');

// Resizing Images //
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`starter/public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    // if the current field in one of the allowed fields, well then newObj with the feild name of the current feild, should be equal to whatever is in the object at the current element, so the current field name
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// 2) Route Handlers
// Implementing Users Route part-1

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   // res.status(500).json({
//   //   status: 'error',
//   //   messgae: 'This route is not yet defined!',
//   // });
//   const users = await User.find();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });
exports.getAllUsers = factory.getAll(User);

// Updating the Current User: Data //
// It's for updating the currently authenticated user.
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // 1) Create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // Saving Image Name to Database //
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user data
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// Deleting the Current User //
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     messgae: 'This route is not yet defined!',
//   });
// };
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messgae: 'This route is not defined! Please use /signup instead',
  });
};

// exports.UpdateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     messgae: 'This route is not yet defined!',
//   });
// };
// Do not update password with this!
exports.UpdateUser = factory.updateOne(User);

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     messgae: 'This route is not yet defined!',
//   });
// };
exports.deleteUser = factory.deleteOne(User);
