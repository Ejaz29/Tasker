const User = require('./../models/userModel');
const Task = require('./../models/taskModel');
const catchAsync = require('./../Error Handler/catchAsync');
const appError = require('../Error Handler/appError');

exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.findById(req.user.id).populate('tasks');
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const allowedFields = ['name', 'email'];
  const filterObj = {};
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filterObj[el] = req.body[el];
  });
  const user = await User.findByIdAndUpdate(req.user.id, filterObj, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUserTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ owner: req.user.id });
  if (!req.body.id) {
    return next(new appError('Please provide id of the task', 400));
  }
  let task;
  tasks.forEach((el) => {
    if (el._id == req.body.id) {
      task = el;
    }
  });
  if (!task) {
    return next(new appError('No task is present with that id', 400));
  }
  let statusCode;
  if (req.body.completed) {
    statusCode = 204;
    task = await Task.findByIdAndDelete(req.body.id);
  } else if (req.body.name) {
    statusCode = 200;
    task = await Task.findByIdAndUpdate(req.body.id, req.body.name);
  } else if (req.body.description) {
    statusCode = 200;
    task = await Task.findByIdAndUpdate(req.body.id, req.body.description);
  }
  res.status(statusCode).json({
    status: 'success',
    data: {
      task,
    },
  });
});
