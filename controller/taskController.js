const Task = require('./../models/taskModel');
const catchAsync = require('./../Error Handler/catchAsync');

exports.createTask = catchAsync(async (req, res, next) => {
  req.body.owner = req.user.id;
  const task = await Task.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.getTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ owner: req.user.id }).select(
    'name description completed'
  );
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  });
});
