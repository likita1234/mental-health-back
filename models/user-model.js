const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  confirmPassword: {
    type: String,
    validate: {
      message: 'Password and Confirm Password field must match',
      validator: function (val) {
        return this.password === this.confirmPassword;
      },
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

//  Middlewares to generate fullname

userSchema.pre('save', function (next) {
  this.fullname = this.name + ' ' + this.surname;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
