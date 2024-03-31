const natural = require('natural');
const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();

// Define stopwords (verbs, pronouns, and articles)
const stopwords = new Set([
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
]);

// Analysis by a particular sentence
exports.analyzeSentence = (sentence) => {
  const wordFreq = {};
  const tokens = tokenizer.tokenize(sentence.toLowerCase());
  // Generate bi-grams
  const biGrams = NGrams.bigrams(tokens);
  biGrams.forEach((biGram) => {
    const token = biGram.join(' '); 
    if (!stopwords.has(token)) {
      // Exclude stopwords
      if (wordFreq[token]) {
        wordFreq[token]++;
      } else {
        wordFreq[token] = 1;
      }
    }
  });
  return wordFreq;
};

// Function to tokenize text, remove stopwords, and perform frequency analysis
exports.analyzeWordsFrequencyFromAnswers = (answers) => {
  if (answers && answers.length > 0) {
    // Perform analysis
    const wordFrequency = analyzeText(answers);

    // Sort word frequency by frequency
    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [word, frequency]) => {
        acc[word] = frequency;
        return acc;
      }, {});
  }
  return {};
};

// Function to tokenize text, remove stopwords, and perform frequency analysis
const analyzeText = (texts) => {
  const wordFreq = {};
  texts.forEach((text) => {
    const tokens = tokenizer.tokenize(text.toLowerCase());
    // Generate bi-grams
    const biGrams = NGrams.bigrams(tokens);
    biGrams.forEach((biGram) => {
      const token = biGram.join(' '); // Convert bi-gram array to string
      if (!stopwords.has(token)) {
        // Exclude stopwords
        if (wordFreq[token]) {
          wordFreq[token]++;
        } else {
          wordFreq[token] = 1;
        }
      }
    });
  });
  return wordFreq;
};
