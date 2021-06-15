const buildSearchEngine = (documents) => ({
  documents,
  search: (searchPhrase) => documents.filter(({ text }) => text.split(' ').includes(searchPhrase))
    .map(({ id }) => id),
});
export default buildSearchEngine;
