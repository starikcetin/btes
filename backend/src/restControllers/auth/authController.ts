import { Body, Controller, Post, Res, Route, Tags, Request, Get } from 'tsoa';
import { Security, SuccessResponse, TsoaResponse } from '@tsoa/runtime';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserModel } from '../../database/UserModel';
import { hasValue } from '../../common/utils/hasValue';
import { UserData } from '../../common/database/UserData';
import { authTokenBlacklistService } from '../../auth/authTokenBlacklistService';
import { AuthRegisterRequestBody } from '../../common/auth/AuthRegisterBody';
import { AuthUpdateRequestBody } from '../../common/auth/AuthUpdateBody';
import { AuthLoginRequestBody } from '../../common/auth/AuthLoginBody';
import { decodeAuthToken } from '../../auth/decodeAuthToken';
import { AuthenticatedExpressRequest } from '../../auth/AuthenticatedExpressRequest';
import { TokenValidationResponse } from '../../common/auth/TokenValidationResponse';

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
    @Request() req: AuthenticatedExpressRequest,
    @Res() unauthorizedResponse: TsoaResponse<401, { reason: string }>
  ): Promise<void> {
    const authToken = req.headers.authorization;

    if (!hasValue(authToken)) {
      return unauthorizedResponse(401, { reason: 'No auth token.' });
    }

    await authTokenBlacklistService.addToBlacklist(authToken);
  }

  /**
   * Returns whether the given auth token is still valid.
   * Format must be: `Bearer auth_token_here`
   */
  @Get('validateAuthToken/{authToken}')
  public async validateAuthToken(
    authToken: string
  ): Promise<TokenValidationResponse> {
    try {
      const decoded = await decodeAuthToken(authToken);
      return hasValue(decoded) && hasValue(decoded.username)
        ? { isTokenValid: true }
        : {
            isTokenValid: false,
            reason: 'Decoded token is invalid.',
          };
    } catch (err) {
      return { isTokenValid: false, reason: err.toString() };
    }
  }

  /**
   * Return the details of the user that bears the token in the authorization header.
   */
  @Get('userDetails')
  @Security('jwt')
  public async userDetails(
    @Request() req: AuthenticatedExpressRequest
  ): Promise<UserData> {
    const { username } = req.user;

    const foundUser = await UserModel.findOne({ username });

    if (!hasValue(foundUser)) {
      throw new Error(`User not found. Username: ${username}`);
    }

    return foundUser;
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

  /**
   * Check username is available or not
   * return boolean.
   */
  @Get('isUsernameAvailable/{username}')
  public async isUsernameAvailable(username: string): Promise<boolean> {
    const existingUser = await UserModel.findOne({ username });
    if (!hasValue(existingUser)) {
      return true;
    }
    return false;
  }

  /**
   * Check email is available or not
   * return boolean.
   */
  @Get('isEmailAvailable/{email}')
  public async isEmailAvailable(email: string): Promise<boolean> {
    const existingUser = await UserModel.findOne({ email });
    if (!hasValue(existingUser)) {
      return true;
    }
    return false;
  }

  /**
   * Update a User.
   * Returns the updated User.
   */
  @SuccessResponse(201, 'Updated')
  @Post('update')
  @Security('jwt')
  public async update(
    @Body() body: AuthUpdateRequestBody,
    @Res() unauthorizedResponse: TsoaResponse<401, { reason: string }>
  ): Promise<boolean> {
    const { oldUsername, username, email, newPassword } = body;
    const existingUser = await UserModel.findOne({ username: oldUsername });
    if (!hasValue(existingUser)) {
      return unauthorizedResponse(401, { reason: 'Incorrect username.' });
    }
    try {
      const result = await UserModel.updateOne(
        { username: oldUsername },
        {
          username,
          passwordHash: await bcrypt.hash(newPassword, 10),
          email,
        }
      );
      return result.ok === 1 ? true : false;
    } catch (e) {
      console.log(e.toString());
      return e.toString();
    }
  }
}
