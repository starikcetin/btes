/*
 * The type declarations from `@types/jsum` package was wrong. so I wrote my own.
 * ~ Tarık, 2021-03-16
 */

declare module 'jsum' {
  import { BinaryToTextEncoding } from 'crypto';

  /**
   * Creates hash of given JSON object.
   *
   * @param obj JSON object
   * @param hashAlgorithm hash algorithm (e.g. SHA256)
   * @param encoding hash encoding (e.g. base64)
   */
  export function digest(
    obj: unknown,
    hashAlgorithm: string,
    encoding: BinaryToTextEncoding
  ): string;

  /**
   * Creates hash of given JSON object.
   *
   * @param obj JSON object
   * @param hashAlgorithm hash algorithm (e.g. SHA256)
   */
  export function digest(obj: unknown, hashAlgorithm: string): Buffer;

  /**
   * Stringifies a JSON object (not any random JS object).
   *
   * It should be noted that JS objects can have members of
   * specific type (e.g. function), that are not supported
   * by JSON.
   *
   * @param obj JSON object
   * @returns stringified JSON object.
   */
  export function stringify(obj: unknown): string;
}
