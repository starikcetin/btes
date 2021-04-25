export const ensureDate = (val: number | string | Date): Date => {
  switch (Object.prototype.toString.call(val)) {
    case '[object Date]':
      return val as Date;

    case '[object String]':
      return new Date(Date.parse(val as string));

    case '[object Number]':
      return new Date(val as number);
  }

  throw new Error(
    `Unsupported type for 'val'.\nType: ${typeof val}\nValue: ${val}`
  );
};
