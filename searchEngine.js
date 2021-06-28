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

    const matchedDocs = documents.filter(({ text }) => {
      const words = text.split(' ');
      return words.some((word) => {
        const cleanedWord = getNormalizedWord(word);
        return purePhrases.some((phrase) => phrase === cleanedWord);
      });
    });

    const relevanceResults = matchedDocs.reduce((acc, { id, text }) => {
      const words = text.split(' ');
      return [...acc, { id, count: getNumberOfMatches(words, phrases) }];
    }, []);
    relevanceResults.sort((a, b) => b.count - a.count);

    return relevanceResults.map(({ id }) => id);
  },
});
module.exports = buildSearchEngine;
