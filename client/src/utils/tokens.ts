import jwt, { Secret, SignOptions } from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  role: string;
};

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET || "fallback_access_secret";
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret";

const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES || "15m") as SignOptions["expiresIn"];
const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES || "7d") as SignOptions["expiresIn"];

export function signAccessToken(userId: string, role: string): string {
  const payload: TokenPayload = { userId, role };

  const options: SignOptions = {
    expiresIn: accessExpiresIn,
  };

  return jwt.sign(payload, accessSecret, options);
}

export function signRefreshToken(userId: string, role: string): string {
  const payload: TokenPayload = { userId, role };

  const options: SignOptions = {
    expiresIn: refreshExpiresIn,
  };

  return jwt.sign(payload, refreshSecret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, accessSecret) as TokenPayload;
}
