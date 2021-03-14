/** Iterates a generator until it is done. Returns the return value and all the yields. */
export const collectGenerator = <T, TReturn, TNext>(
  gen: Generator<T, TReturn, TNext>
): {
  /** All the `yield` results */
  yields: T[];
  /** The `return` result */
  ret: TReturn;
} => {
  const yields: T[] = [];

  for (;;) {
    const res = gen.next();

    if (res.done === true) {
      return { yields, ret: res.value };
    } else {
      yields.push(res.value);
    }
  }
};
