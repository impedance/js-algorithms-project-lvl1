import { expect, test } from '@jest/globals';
import buildSearchEngine from './searchEngine';

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];
const searchEngine = buildSearchEngine(docs);

test('finds documents', () => {
  expect(searchEngine.search('shoot')).toEqual(['doc1', 'doc2']);
  expect(searchEngine.search('straight')).toEqual(['doc1']);
  // expect(searchEngine.search('shooter')).toEqual(['doc3']);
});
test.skip('returns empty result', () => {
  expect(searchEngine.search('hello')).toEqual([]);
});
