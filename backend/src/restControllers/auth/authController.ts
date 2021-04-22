import { Body, Controller, Post, Res, Route, Tags, Request } from 'tsoa';
import { Security, SuccessResponse, TsoaResponse } from '@tsoa/runtime';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';

import { UserModel } from '../../database/UserModel';
import { hasValue } from '../../common/utils/hasValue';
import { UserData } from '../../common/database/UserData';
import { authTokenBlacklistService } from '../../auth/authTokenBlacklistService';
import { AuthRegisterRequestBody } from '../../common/auth/AuthRegisterBody';
import { AuthLoginRequestBody } from '../../common/auth/AuthLoginBody';

const authTokenSecret = process.env.AUTH_TOKEN_SECRET;

@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {
  /**
   * Creates a new User.
   * Returns the created User.
   */
  @SuccessResponse(201, 'Created')
  @Post('register')
  public async register(
    @Body() body: AuthRegisterRequestBody
  ): Promise<UserData> {
    const { username, password, email } = body;
    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await UserModel.create({
      username,
      passwordHash,
      email,
    });

    this.setStatus(201);
    return createdUser;
  }

  /**
   * Logs-in an existing User.
   * Returns the auth token. Auth token expires in 30 minutes.
   */
  @Post('login')
  public async login(
    @Body() body: AuthLoginRequestBody,
    @Res() unauthorizedResponse: TsoaResponse<401, { reason: string }>
  ): Promise<string> {
    const { username, password } = body;

    const existingUser = await UserModel.findOne({ username });
    if (!hasValue(existingUser)) {
      return unauthorizedResponse(401, { reason: 'Incorrect username.' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!isPasswordCorrect) {
      return unauthorizedResponse(401, { reason: 'Incorrect password.' });
    }

    if (!hasValue(authTokenSecret)) {
      throw new Error('AUTH_TOKEN_SECRET has no value!');
    }

    const authToken = jwt.sign({ username }, authTokenSecret, {
      expiresIn: '30m',
    });

    authTokenBlacklistService.removeFromBlacklist(authToken);

    return authToken;
  }

  /**
   * Logs-out a user.
   * More specifically, terminates an auth token.
   */
  @Post('logout')
  @Security('jwt')
  public async logout(
    @Request() req: express.Request,
    @Res() unauthorizedResponse: TsoaResponse<401, { reason: string }>
  ): Promise<void> {
    const authToken = req.headers.authorization;

    if (!hasValue(authToken)) {
      return unauthorizedResponse(401, { reason: 'No auth token.' });
    }

    await authTokenBlacklistService.addToBlacklist(authToken);
  }

  /**
   * An auth-protected route for testing purposes.
   * Echoes the body back.
   */
  @Post('secure-echo')
  @Security('jwt')
  public async secureEcho(
    @Body() body: { message: string }
  ): Promise<{ message: string }> {
    return body;
  }
}
