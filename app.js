const express = require('express');
const taskRouter = require('./routes/taskRouter');
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./Error Handler/errorHandlingMiddleware');
const appError = require('./Error Handler/appError');
require('./emails/remainder');
const app = express();
app.use(express.json());

app.use('/tasker/tasks', taskRouter);
app.use('/tasker/user', userRouter);

app.all('*', (req, res, next) => {
  return next(new appError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler);
module.exports = app;
