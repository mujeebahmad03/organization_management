export interface JwtPayload {
  sub: number;
  username: string;
  iss?: string; // Issuer
  aud?: string; // Audience
  iat?: number; // Issued at (auto-handled by JWT library)
  exp?: number; // Expiry timestamp (auto-handled by JWT library)
}

export interface Token {
  accessToken: string;
}
