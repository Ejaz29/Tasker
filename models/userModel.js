const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, 'please provide valid email'],
    },
    password: {
      type: String,
      required: [true, 'A user must set a password'],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please provide the confirm password'],
      validate: {
        validator: function (confirmPassword) {
          return confirmPassword === this.password;
        },
        message: 'Password and confirm password are not same',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  passwordFromUser,
  passwordStoredInDB
) {
  return await bcrypt.compare(passwordFromUser, passwordStoredInDB);
};

userSchema.virtual('tasks', {
  ref: 'Task',
  foreignField: 'owner',
  localField: '_id',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
