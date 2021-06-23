const hasSearchPhrase = (word, phrase) => {
  const normalizedWord = word.match(/\w+/g)[0];
  const normalizedPhrase = phrase.match(/\w+/g)[0];
  return normalizedPhrase === normalizedWord;
};
const buildSearchEngine = (documents) => ({
  search: (searchPhrase) => {
    const filteredDocs = documents.filter(({ text }) => {
      const words = text.split(' ');
      return words.some((word) => hasSearchPhrase(word, searchPhrase));
    });
    return filteredDocs.map(({ id }) => id);
  },
});
module.exports = buildSearchEngine;
