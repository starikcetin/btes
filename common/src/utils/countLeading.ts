import _ from 'lodash';

export const countLeadingZeroes = (str: string): number =>
  countLeading(str, '0');

export const countLeading = (str: string, char: string): number =>
  _.takeWhile(str, (c) => c === char).length;
