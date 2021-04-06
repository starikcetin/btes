import { hexAlphabet } from './hexAlphabet';

/** Returns whether the given `str` only contains chars from the `hex` (aka `base16`) alphabet. */
export const isHexSafe = (str: string): boolean => {
  for (let i = 0; i < str.length; i++) {
    if (!hexAlphabet.includes(str[i])) {
      return false;
    }
  }

  return true;
};
