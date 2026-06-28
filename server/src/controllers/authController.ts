import crypto from 'crypto';
import { Request, Response } from 'express';
import User from '../models/User';
import { signAccessToken, signRefreshToken } from '../utils/tokens';

const sendTokens = (res: Response, user: any) => {
  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString(), user.role);
  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return { accessToken, refreshToken };
};
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  const tokens = sendTokens(res, user);
  res.status(201).json({ user: { id: user._id, name, email, role: user.role }, ...tokens });
}
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user: any = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });
  const tokens = sendTokens(res, user);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens });
}
export function logout(_req: Request, res: Response) { res.clearCookie('accessToken'); res.json({ message: 'Logged out' }); }
export async function me(req: Request, res: Response) { res.json({ user: req.user }); }
export async function forgotPassword(req: Request, res: Response) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: 'If account exists, reset token generated' });
  const token = crypto.randomBytes(24).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
  res.json({ message: 'Development reset token generated', resetToken: token });
}
export async function resetPassword(req: Request, res: Response) {
  const hashed = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
}
