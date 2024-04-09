// Define custom list of stopwords (articles, prepositions, conjunctions, pronouns, and auxiliary verbs)

exports.customStopwords = new Set([
  // Articles
  'a',
  'an',
  'the',
  // Prepositions
  'aboard',
  'about',
  'above',
  'across',
  'after',
  'against',
  'along',
  'amid',
  'among',
  'around',
  'as',
  'at',
  'before',
  'behind',
  'below',
  'beneath',
  'beside',
  'between',
  'beyond',
  'but',
  'by',
  'concerning',
  'considering',
  'despite',
  'down',
  'during',
  'except',
  'excepting',
  'excluding',
  'following',
  'for',
  'from',
  'in',
  'inside',
  'into',
  'like',
  'minus',
  'near',
  'of',
  'off',
  'on',
  'onto',
  'opposite',
  'outside',
  'over',
  'past',
  'per',
  'plus',
  'regarding',
  'round',
  'save',
  'since',
  'than',
  'through',
  'to',
  'toward',
  'towards',
  'under',
  'underneath',
  'unlike',
  'until',
  'up',
  'upon',
  'versus',
  'via',
  'with',
  'within',
  'without',
  // Conjunctions
  'and',
  'or',
  'but',
  'nor',
  'for',
  'so',
  'yet',
  'after',
  'although',
  'as',
  'as if',
  'as long as',
  'as much as',
  'as soon as',
  'as though',
  'because',
  'before',
  'even if',
  'even though',
  'if',
  'if only',
  'if when',
  'if then',
  'inasmuch as',
  'just as',
  'lest',
  'now',
  'now that',
  'once',
  'provided',
  'rather than',
  'since',
  'so that',
  'supposing',
  'than',
  'that',
  'though',
  'til',
  'unless',
  'until',
  'when',
  'whenever',
  'where',
  'whereas',
  'wherever',
  'whether',
  'while',
  'whilst',
  'who',
  'whoever',
  'whom',
  'whomever',
  'whose',
  'why',
  'yet',
  // Pronouns
  'i',
  'me',
  'my',
  'myself',
  'we',
  'us',
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
  'who',
  'whom',
  'whose',
  'which',
  'what',
  'that',
  'these',
  'those',
  'some',
  'any',
  'none',
  'all',
  'one',
  'each',
  'every',
  'another',
  'anybody',
  'anyone',
  'anything',
  'everyone',
  'everybody',
  'everything',
  'somebody',
  'someone',
  'something',
  'no one',
  'nobody',
  'nothing',
  'something',
  'anywhere',
  'everywhere',
  'nowhere',
  'somewhere',
  'anytime',
  'every time',
  'no time',
  'some time',
  'anywhere',
  'everywhere',
  'nowhere',
  'somewhere',
  // Auxiliary Verbs
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'being',
  'been',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'shall',
  'should',
  'would',
  'may',
  'might',
  'must',
  'can',
  'could',
  // personal stopwords
  'here',
  'first',
  'arrived',
  'used',
  'more',
  'host',
  'local',
  'back',
  'due',
  'how',
  'took',
  'found',
]);