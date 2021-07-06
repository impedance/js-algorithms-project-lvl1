/**
 * @param {string} word
 * @returns string
 */
const getNormalizedWord = (word) => word.match(/\w+/g)[0];

/**
 * @param {string[]} content
 * @param {string[]} searchPhrases
*/
const getNumberOfMatches = (content, searchPhrases) => {
  let counter = 0;
  for (let i = 0; i < content.length; i += 1) {
    const currentWord = content[i];
    const cleanedWord = getNormalizedWord(currentWord);
    if (searchPhrases.includes(cleanedWord)) {
      counter += 1;
    }
  }
  return counter;
};

/**
 * @param {{id: string, text: string}[]} docs
 * @returns {{}}
 */
const getInvertedIndex = (docs) => docs.reduce((acc, { id, text }) => {
  const pureWords = text.split(' ').map(getNormalizedWord);
  const wordsToId = pureWords.reduce((coll, word) => ({ ...coll, [word]: [id] }), {});
  let newAcc = { ...acc };
  Object.keys(wordsToId).forEach((key) => {
    if (newAcc[key]) {
      newAcc = { ...newAcc, [key]: [...newAcc[key], ...wordsToId[key]] };
    } else {
      newAcc = { ...newAcc, [key]: [...wordsToId[key]] };
    }
  });
  return newAcc;
}, {});

/**
 * @param {{id: string, text: string}[]} documents
 * @returns {{search: (arg0: string) => string[]}}
 */
const buildSearchEngine = (documents) => ({
  /**
   * @param {string} searchPhrase
   * @returns {string[]}
   */
  search: (searchPhrase) => {
    if (documents.length === 0) {
      return [];
    }

    const phrases = searchPhrase.split(' ');
    const purePhrases = phrases.map(getNormalizedWord);

    const indexedWords = getInvertedIndex(documents);

    const matchedKeys = Object.keys(indexedWords).filter((key) => {
      return purePhrases.some(phrase => phrase === key);
    });

    const matchedIds = matchedKeys.reduce((acc, key) => [...acc, ...indexedWords[key]], []);
    const matchedDocs = documents.filter(({ id }) => matchedIds.includes(id));

    const relevanceResults = matchedDocs.reduce((acc, { id, text }) => {
      const words = text.split(' ');
      return [...acc, { id, count: getNumberOfMatches(words, phrases) }];
    }, []);

    relevanceResults.sort((a, b) => b.count - a.count);

    return relevanceResults.map(({ id }) => id);
  },
});
module.exports = buildSearchEngine;
