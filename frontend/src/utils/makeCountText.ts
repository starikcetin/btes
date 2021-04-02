export const pluralize = (
  count: number,
  word: string,
  customPlural?: string
): string => {
  const isPlural = count === 0 || count > 1;
  const pluralForm = customPlural ?? word + 's';
  return isPlural ? pluralForm : word;
};

export const makeCount = (count: number, customZero?: string): string => {
  return `${count === 0 ? customZero ?? count : count}`;
};

export const makeCountText = (
  count: number,
  word: string,
  opts?: {
    prefix?: boolean;
    plural?: string;
    zero?: string;
  }
): string => {
  const { plural, zero, prefix } = opts ?? {};

  const countPart = prefix ? `${makeCount(count, zero)} ` : '';
  return countPart + pluralize(count, word, plural);
};
