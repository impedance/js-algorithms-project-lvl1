const { expect, test } = require('@jest/globals');
const buildSearchEngine = require('./searchEngine');

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at I me." };
const doc3 = { id: 'doc3', text: "I'm your shooter. I'm master. I'm benefactor" };
const docs = [doc1, doc2, doc3];
const searchEngine = buildSearchEngine(docs);

test('finds documents', () => {
  expect(searchEngine.search('shoot')).toEqual(['doc2', 'doc1']);
  expect(searchEngine.search('shoot at me')).toEqual(['doc2', 'doc1']);
  expect(searchEngine.search('straight')).toEqual(['doc1']);
  // expect(searchEngine.search('I')).toEqual(['doc3', 'doc1', 'doc2']);
  expect(searchEngine.search('I straight shooter')).toEqual(['doc3', 'doc1', 'doc2']);
  expect(searchEngine.search('pint')).toEqual(['doc1']);
  expect(searchEngine.search('pint!')).toEqual(['doc1']);
  expect(searchEngine.search('me.')).toEqual(['doc2']);
  expect(searchEngine.search('apple')).toEqual([]);
});

const searchEngine2 = buildSearchEngine([]);

test('returns empty result', () => {
  expect(searchEngine2.search('hello')).toEqual([]);
  expect(searchEngine2.search('')).toEqual([]);
});
