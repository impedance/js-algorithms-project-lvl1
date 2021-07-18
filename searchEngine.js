/**
 * @param {string} word
 * @returns string
 */
const getNormalizedWord = (word) => word.match(/\w+/g)[0];

/**
 * @param {string[]} words
 * @param {string[]} searchPhrases
*/
const getNumberOfMatches = (words, searchPhrases) => {
  const wordsQuantity = words.length;
  let numberOfMatches = 0;
  // let matchedDocsCount = 0;
  for (let i = 0; i < wordsQuantity; i += 1) {
    const currentWord = words[i];
    const cleanedWord = getNormalizedWord(currentWord);

    if (searchPhrases.includes(cleanedWord)) {
      // matchedDocsCount = invertedIndex[cleanedWord].length;
      numberOfMatches += 1;
    }
  }

  // const termFrequency = numberOfMatches / wordsQuantity;
  // const idf = Math.fround(Math.log(docsNum / matchedDocsCount));
  // console.log(docsNum, matchedDocsCount)
  // console.log(Math.round(docsNum / matchedDocsCount));
  // console.log(termFrequency, idf);
  // const wordWeight = termFrequency * idf;
  return numberOfMatches;
};

/**
 * @param {{id: string, text: string}[]} docs
 * @returns {{}}
 */
const getInvertedIndex = (docs) => docs.reduce((acc, { id, text }) => {
  const pureWords = text.split(' ').map(getNormalizedWord);
  const wordsToId = pureWords.reduce((coll, word) => (
    { ...coll, [word]: [{ id, count: getNumberOfMatches(pureWords, [word]) }] }
  ), {});
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

    const matchedDocs = purePhrases.reduce((acc, phrase) => {
      if (indexedWords[phrase]) {
        return [...acc, ...indexedWords[phrase]];
      }
      return [];
    }, []);

    const docsWithRelevance = matchedDocs.reduce((acc, { id, count }) => {
      if (acc[id]) {
        const { relevanceSum } = acc[id];
        const newRelevanceSum = relevanceSum + count;
        return { ...acc, [id]: { relevanceSum: newRelevanceSum } };
      }
      return { ...acc, [id]: { relevanceSum: count } };
    }, {});
    console.log(docsWithRelevance);
    return Object.keys(docsWithRelevance).sort((a, b) => docsWithRelevance[b].relevanceSum - docsWithRelevance[a].relevanceSum);

  },
});
module.exports = buildSearchEngine;
