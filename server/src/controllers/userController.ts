import { Request, Response } from 'express';
import User from '../models/User';

export async function profile(req: Request, res: Response) { res.json({ user: req.user }); }
export async function updateProfile(req: Request, res: Response) { const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password'); res.json(user); }
export async function changePassword(req: Request, res: Response) { const user: any = await User.findById(req.user._id).select('+password'); if (!(await user.comparePassword(req.body.currentPassword))) return res.status(400).json({ message: 'Wrong password' }); user.password = req.body.newPassword; await user.save(); res.json({ message: 'Password changed' }); }
export async function getWishlist(req: Request, res: Response) { const user = await User.findById(req.user._id).populate('wishlist'); res.json({ wishlist: user?.wishlist || [] }); }
export async function addWishlist(req: Request, res: Response) { await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.body.productId } }); res.status(201).json({ message: 'Added to wishlist' }); }
export async function removeWishlist(req: Request, res: Response) { await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.id } }); res.json({ message: 'Removed from wishlist' }); }
export async function adminUsers(_req: Request, res: Response) { res.json({ users: await User.find().select('-password') }); }
export async function updateUserRole(req: Request, res: Response) { const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password'); res.json(user); }
export async function deleteUser(req: Request, res: Response) { await User.findByIdAndDelete(req.params.id); res.json({ message: 'User deleted' }); }
