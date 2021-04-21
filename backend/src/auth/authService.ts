import _ from 'lodash';

class AuthService {
  private readonly blacklistedTokens: string[] = [];

  public readonly addToBlacklist = async (authToken: string): Promise<void> => {
    const strippedAuthToken = this.stripToken(authToken);
    if (!this.blacklistedTokens.includes(strippedAuthToken)) {
      this.blacklistedTokens.push(strippedAuthToken);
    }
  };

  public readonly removeFromBlacklist = async (
    authToken: string
  ): Promise<void> => {
    const strippedAuthToken = this.stripToken(authToken);
    _.remove(this.blacklistedTokens, strippedAuthToken);
  };

  public readonly isInBlacklist = async (
    authToken: string
  ): Promise<boolean> => {
    const strippedAuthToken = this.stripToken(authToken);
    return this.blacklistedTokens.includes(strippedAuthToken);
  };

  private readonly stripToken = (rawHeader: string): string => {
    const split = rawHeader.split(' ');
    return split.length === 2 ? split[1] : split[0];
  };
}

export const authService = new AuthService();
