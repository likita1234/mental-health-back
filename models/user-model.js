const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['true', 'User name is required!'],
    trim: true,
  },
  surname: {
    type: String,
    // required: ['true', 'User surname is required!'],
    trim: true,
  },
  fullname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: ['true', 'User email is required!'],
    lowercase: true,
    validate: [validator.isEmail, 'Email is invalid!'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
    );
    // console.log(this.passwordChangedAt, JWTTimestamp);
    // if the time is greater, it means that the password was changed
    return JWTTimestamp < passwordChangedTimestamp;
  }
  return false;
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
