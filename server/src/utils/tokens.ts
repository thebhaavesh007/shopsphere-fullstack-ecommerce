import jwt from 'jsonwebtoken';

export function signAccessToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
}
export function signRefreshToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
}
export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string; role: string };
}
