const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  // Define properties for each language
  english: { type: String, trim: true },
  nepali: { type: String, trim: true },
  // Add more languages as needed
});

module.exports = LanguageSchema;
