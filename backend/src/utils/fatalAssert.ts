/**
 * Asserts a condition is true, and throws an error if it isn't.
 * Unlike regular `console.assert`, this function halts the execution.
 * @param condition The condition that must be true. If this is false, we will throw the error.
 * @param message The error mesage.
 */
export function fatalAssert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed! ${message}`);
  }
}
