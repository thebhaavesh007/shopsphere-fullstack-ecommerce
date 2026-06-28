import { Request, Response } from 'express';
import slugify from 'slugify';
import Category from '../models/Category';
export async function listCategories(_req: Request, res: Response) { res.json({ categories: await Category.find().sort('name') }); }
export async function createCategory(req: Request, res: Response) { const category = await Category.create({ ...req.body, slug: slugify(req.body.name, { lower: true, strict: true }) }); res.status(201).json(category); }
export async function updateCategory(req: Request, res: Response) { const update = { ...req.body }; if (update.name) update.slug = slugify(update.name, { lower: true, strict: true }); res.json(await Category.findByIdAndUpdate(req.params.id, update, { new: true })); }
export async function deleteCategory(req: Request, res: Response) { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Category deleted' }); }
