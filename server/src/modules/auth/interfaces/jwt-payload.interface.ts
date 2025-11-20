export interface JwtPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

export interface Token {
  accessToken: string;
}
