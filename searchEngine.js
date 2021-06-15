const buildSearchEngine = (documents) => ({
  search: (searchPhrase) => {
    const filteredDocs = documents.filter(({ text }) => text.split(' ').includes(searchPhrase));
    return filteredDocs.map(({ id }) => id);
  },
});
export default buildSearchEngine;
