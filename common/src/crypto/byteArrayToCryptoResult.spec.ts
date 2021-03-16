import { byteArrayToCryptoResult } from './byteArrayToCryptoResult';

const base64 = 'fZayBTV+ED3d2Y772LkvigvyUtpRUxbJmoD45WR0adk=';
const byteArray = new Uint8Array([
  125,
  150,
  178,
  5,
  53,
  126,
  16,
  61,
  221,
  217,
  142,
  251,
  216,
  185,
  47,
  138,
  11,
  242,
  82,
  218,
  81,
  83,
  22,
  201,
  154,
  128,
  248,
  229,
  100,
  116,
  105,
  217,
]);

it('converts to CryptoResult from byte array', () => {
  const cryptoResult = byteArrayToCryptoResult(byteArray);

  expect(cryptoResult.base64).toBe(base64);
  expect(cryptoResult.byteArray).toStrictEqual(byteArray);
});
