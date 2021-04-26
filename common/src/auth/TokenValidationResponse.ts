export type TokenValidationResponse = TokenValidResponse | TokenInvalidResponse;

export interface TokenValidResponse {
  isTokenValid: true;
}

export interface TokenInvalidResponse {
  isTokenValid: false;
  reason: string;
}
