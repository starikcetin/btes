import * as jwt from 'jsonwebtoken';

import { hasValue } from '../common/utils/hasValue';
import { authTokenBlacklistService } from './authTokenBlacklistService';
import { AuthTokenData } from './AuthTokenData';

export const decodeAuthToken = async (
  authToken: string
): Promise<AuthTokenData> => {
  const authTokenSecret = process.env.AUTH_TOKEN_SECRET;

  if (typeof authToken !== 'string') {
    throw new Error(`Malformed auth token.`);
  }

  const splitAuthToken = authToken.split(' ');
  if (splitAuthToken.length !== 2 || splitAuthToken[0] !== 'Bearer') {
    throw new Error('Malformed auth token.');
  }
  const strippedAuthToken = splitAuthToken[1];

  if (await authTokenBlacklistService.isInBlacklist(strippedAuthToken)) {
    throw new Error('This token has logged-out.');
  }

  if (!hasValue(authTokenSecret)) {
    throw new Error(`Auth token secret not set!`);
  }

  return new Promise<AuthTokenData>((resolve, reject) => {
    jwt.verify(strippedAuthToken, authTokenSecret, (err, decoded) => {
      if (hasValue(err)) {
        reject(err);
      } else if (!hasValue(decoded)) {
        reject(new Error('No JWT errors, but no decoded value!'));
      } else {
        resolve(decoded as AuthTokenData);
      }
    });
  });
};
