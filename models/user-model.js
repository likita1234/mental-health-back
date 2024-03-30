const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['true', 'User name is required!'],
    trim: true,
  },
  surname: {
    type: String,
    required: ['true', 'User surname is required!'],
    trim: true,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: ['true', 'User email is required!'],
    lowercase: true,
    validate: [validator.isEmail, 'Email is invalid!'],
  },
  password: {
    type: String,
    required: ['true', 'User Password is required!'],
    minLength: [8, 'Password must be atleast 8 characters!'],
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password and Confirm Password field must match',
    },
  },
  active: {
    type: Boolean,
    default: 1,
  },
  attachment: {
    type: String,
  },
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//  Middlewares to generate fullname, encrypt password
userSchema.pre('save', async function (next) {
  this.fullname = this.name + ' ' + this.surname;
  //   Only run this function if password wasn't actually modified
  if (!this.isModified('password')) return next();

  //   Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // dont save confirmPassword since its only needed for verification during signup not for save
  this.confirmPassword = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
