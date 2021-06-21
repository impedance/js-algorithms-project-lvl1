const isNeededPhrase = (word, phrase) => {
  const normalizedWord = word.match(/\w+/g)[0];
  const normalizedSearchPhrase = phrase.match(/\w+/g)[0];
  return normalizedSearchPhrase === normalizedWord;
};
const buildSearchEngine = (documents) => ({
  search: (searchPhrase) => {
    const filteredDocs = documents.filter(({ text }) => {
      const words = text.split(' ');
      return words.some((word) => isNeededPhrase(word, searchPhrase));
    });
    return filteredDocs.map(({ id }) => id);
  },
});
module.exports = buildSearchEngine;
