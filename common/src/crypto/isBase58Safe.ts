import { base58Alphabet } from './base58Alphabet';

/** Returns whether the given `str` only contains chars from the `base58` alphabet. */
export const isBase58Safe = (str: string): boolean => {
  for (let i = 0; i < str.length; i++) {
    if (!base58Alphabet.includes(str[i])) {
      return false;
    }
  }

  return true;
};
