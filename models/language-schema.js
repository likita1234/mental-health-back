const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  // Define properties for each language
  english: { type: String, trim: true },
  nepalese: { type: String, trim: true },
  // Add more languages as needed
});

module.exports = LanguageSchema;
