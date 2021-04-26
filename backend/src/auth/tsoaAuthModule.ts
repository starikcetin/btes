import * as express from 'express';

import { hasValue } from '../common/utils/hasValue';
import { decodeAuthToken } from './decodeAuthToken';
import { AuthTokenData } from './AuthTokenData';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _scopes?: string[]
): Promise<AuthTokenData> {
  if (securityName !== 'jwt') {
    throw new Error('Security method not supported.');
  }

  const authToken = request.headers.authorization;

  if (!hasValue(authToken)) {
    throw new Error('No auth token provided.');
  }

  return decodeAuthToken(authToken);
}
