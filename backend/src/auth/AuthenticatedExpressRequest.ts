import * as express from 'express';

import { AuthTokenData } from './AuthTokenData';

export type AuthenticatedExpressRequest = express.Request & {
  user: AuthTokenData;
};
