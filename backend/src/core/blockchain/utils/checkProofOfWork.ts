import { countLeadingZeroes } from '../../../utils/countLeading';

/** Checks if the given `hash` has at least given `leadingZeroCount`. */
export const checkProofOfWork = (
  hash: string,
  leadingZeroCount: number
): boolean => {
  return countLeadingZeroes(hash) >= leadingZeroCount;
};
