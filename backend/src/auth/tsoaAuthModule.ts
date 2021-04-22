/* eslint-disable @typescript-eslint/ban-types -- reason: we have no control over the `decoded` type of `jwt.verify` */

import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { hasValue } from '../common/utils/hasValue';
import { authTokenBlacklistService } from './authTokenBlacklistService';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _scopes?: string[]
): Promise<object> {
  if (securityName !== 'jwt') {
    throw new Error('Security method not supported.');
  }

  const authToken = request.headers.authorization;
  const authTokenSecret = process.env.AUTH_TOKEN_SECRET;

  if (!hasValue(authToken)) {
    throw new Error('No auth token provided.');
  }

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

  return new Promise<object>((resolve, reject) => {
    jwt.verify(strippedAuthToken, authTokenSecret, (err, decoded) => {
      if (hasValue(err)) {
        reject(err);
      } else if (!hasValue(decoded)) {
        reject(new Error('No JWT errors, but no decoded value!'));
      } else {
        resolve(decoded);
      }
    });
  });
}
