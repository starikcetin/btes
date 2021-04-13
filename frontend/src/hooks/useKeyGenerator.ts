import { useCallback } from 'react';

import { hashJsonObj } from '../common/crypto/hashJsonObj';
import { hasValue } from '../common/utils/hasValue';

export type KeyGenerator = (value: unknown, index?: number) => string;

/**
 * * Returns a function for generating `key` props.
 * * Hashes the input.
 * * Optionally accepts an array index to append to the hash.
 */
export const useKeyGenerator = (): KeyGenerator =>
  useCallback(
    (value: unknown, index?: number) =>
      hashJsonObj(value).toString() + hasValue(index) ? `_${index}` : '',
    []
  );
