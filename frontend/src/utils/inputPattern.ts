export const inputPattern = {
  hex: String.raw`[a-fA-F\d]+`,
  base58: String.raw`[1-9A-HJ-NP-Za-km-z]+`,
} as const;
