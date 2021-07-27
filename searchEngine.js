/**
 * @param {string} word
 * @returns string
 */
const getNormalizedWord = (word) => word.match(/\w+/g)[0];

// /**
//  * @param {string} word
//  * @param {Object} documents
//  * @param {Object} indexedWords
// */
// const getWordRelevance = (word, documents, indexedWords) => {
//   const result = indexedWords[word].docs.reduce((acc, { termFrequency }) => {
// }, {});

/**
 * @param {number} matchedDocsCount
 * @param {number} docsCount
 */
const getInverseDocumentFrequency = (matchedDocsCount, docsCount) => {
  return Math.log10(docsCount / matchedDocsCount).toPrecision(2);
};

/**
 * @param {string} word
 * @param {string[]} phrases
 * @returns number
 */
const getNumberOfMatches = (word, phrases) => {
  let counter = 0;
  phrases.forEach((phrase) => {
    if (word === phrase) {
      counter += 1;
    }
  });
  return counter;
};

/**
 * @param {{id: string, text: string}[]} docs
 * @returns {{}}
 */
const getInvertedIndex = (docs) => docs.reduce((acc, { id, text }) => {
  const pureWords = text.split(' ').map(getNormalizedWord);
  const wordsToDocs = pureWords.reduce((coll, word) => {
    const matchesCount = getNumberOfMatches(word, pureWords);
    const wordsCount = pureWords.length;
    const termFrequency = Number((matchesCount / wordsCount).toPrecision(2));

    return { ...coll, [word]: { docs: [{ id, termFrequency }] } };
  }, {});
  let newAcc = { ...acc };
  Object.keys(wordsToDocs).forEach((key) => {
    const docsContainsWord = wordsToDocs[key];
    if (newAcc[key]) {
      newAcc = { ...newAcc, [key]: { docs: [...newAcc[key].docs, ...docsContainsWord.docs] } };
    } else {
      newAcc = { ...newAcc, [key]: { docs: [...docsContainsWord.docs] } };
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

    const wordsWithIdf = Object.keys(indexedWords).reduce((acc, word) => {
      const matchedDocsCount = indexedWords[word].docs.length;
      const docsCount = documents.length;
      const idf = getInverseDocumentFrequency(matchedDocsCount, docsCount);
      return { ...acc, [word]: { docs: [...indexedWords[word].docs], idf } };
    }, {});

    const matchedDocs = purePhrases.reduce((acc, phrase) => {
      if (wordsWithIdf[phrase]) {
        const { idf, docs } = wordsWithIdf[phrase];
        const idfiedDocs = docs.map(({ id, termFrequency }) => {
          const tfIdf = (termFrequency * idf).toPrecision(2);
          return { id, tfIdf };
        });
        // const sortedDocs = docs.sort((first, next) => {
        //   return (next.termFrequency * idf) - (first.termFrequency * idf);
        // });
        return [...acc, ...idfiedDocs];
      }
      return acc;
    }, []);
    console.log(matchedDocs);

    matchedDocs.map((doc) => {
      if(acc[doc]) {
        
      }
    });
    // const docsWithRelevance = matchedDocs.reduce((acc, { id, count }) => {
    //   if (acc[id]) {
    //     const { relevanceSum } = acc[id];
    //     const newRelevanceSum = relevanceSum + count;
    //     return { ...acc, [id]: { relevanceSum: newRelevanceSum } };
    //   }
    //   return { ...acc, [id]: { relevanceSum: count } };
    // }, {});
    // return Object.keys(docsWithRelevance).sort((a, b) => {
    //   return docsWithRelevance[b].relevanceSum - docsWithRelevance[a].relevanceSum;
    // });
  },
});
module.exports = buildSearchEngine;
