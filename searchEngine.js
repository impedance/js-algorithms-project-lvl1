/**
 * @param {string} word
 * @returns string
 */
const getNormalizedWord = (word) => word.match(/\w+/g)[0];

/**
 * @param {string[]} content
 * @param {string} phrase
*/
const getNumberOfMatches = (content, phrase) => {
  let counter = 0;
  for (let i = 0; i < content.length; i += 1) {
    const cleanedWord = getNormalizedWord(content[i]);
    if (phrase === cleanedWord) {
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
    const cleanedPhrase = getNormalizedWord(searchPhrase);

    const matchedDocs = documents.filter(({ text }) => {
      const words = text.split(' ');
      return words.some((word) => {
        const cleanedWord = getNormalizedWord(word);
        return cleanedWord === cleanedPhrase;
      });
    });

    const relevanceResults = matchedDocs.reduce((acc, { id, text }) => {
      const words = text.split(' ');
      return [...acc, { id, value: getNumberOfMatches(words, cleanedPhrase) }];
    }, []);

    relevanceResults.sort((a, b) => b.value - a.value);

    return relevanceResults.map(({ id }) => id);
  },
});
module.exports = buildSearchEngine;
