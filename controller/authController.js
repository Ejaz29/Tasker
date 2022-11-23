const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const appError = require('./../Error Handler/appError');
const catchAsync = require('./../Error Handler/catchAsync');
const { promisify } = require('util');
const sendgrid = require('./../emails/account');

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = signInToken(user._id);
  sendgrid.sendWelcomeEmail(req.body.email, req.body.name);
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Email or password is empty', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new appError('Invalid email or password', 400));
  }

  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new appError('You are not logged in. Please log in and try again', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new appError('The user belonging to this token does not exist.', 401)
    );
  }
  req.user = user;
  next();
});
