import { expect, test } from '@jest/globals';
import sum from './searchEngine';

test('returns 3', () => {
  expect(sum(1, 2)).toBe(3);
});
