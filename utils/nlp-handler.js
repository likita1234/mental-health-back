const { WordTokenizer, PorterStemmer } = require('natural');
const { customStopwords } = require('./custom-stopwords');

const tokenizer = new WordTokenizer();

// Analysis by answers
exports.analyzeKeywordsFrequencyInAnswers = (answers) => {
  const words = {};

  // Loop through each answer in the array
  answers.forEach((answer) => {
    const tokens = tokenizer.tokenize(answer.toLowerCase());
    tokens.forEach((token) => {
      // Exclude stopwords, single-letter tokens, and tokens that are in custom stopwords
      if (token.length > 3 && !customStopwords.has(token)) {
        const baseToken = token.replace(/(d|es|ed|ies|ly|s|y)$/, ''); // Remove common suffixes
        if (!words[baseToken] || words[baseToken][1] < 1) {
          words[baseToken] = [token, 1];
        } else {
          words[baseToken][1]++;
        }
      }
    });
  });

  // Convert grouped words back to a regular object
  const finalWords = {};
  for (const baseToken in words) {
    const [token, frequency] = words[baseToken];
    finalWords[token] = frequency;
  }

  return sortedWords(finalWords);
};

// Sort the word frequency object by frequency in descending order
const sortedWords = (words) => {
  // Filter out words with frequency below the threshold (e.g., 10)
  const filteredWords = Object.fromEntries(
    Object.entries(words).filter(([_, frequency]) => frequency > 5)
  );

  // Convert object to array of key-value pairs
  const sortedEntries = Object.entries(filteredWords).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // Create a new object from the sorted key-value pairs
  const sortedWordFreq = {};
  sortedEntries.forEach(([key, value]) => {
    sortedWordFreq[key] = value;
  });

  return sortedWordFreq;
};
