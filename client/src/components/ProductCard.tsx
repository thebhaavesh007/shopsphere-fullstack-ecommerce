import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { money, api } from '../services/api';
import { useCart } from '../store/cartStore';
import { Product } from '../types';
export default function ProductCard({p}:{p:Product}){ const {add}=useCart(); return <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="card overflow-hidden group"><Link to={`/products/${p._id}`}><img src={p.images?.[0]} alt={p.name} className="h-56 w-full object-cover group-hover:scale-105 transition duration-500"/></Link><div className="p-5 space-y-3"><div className="flex justify-between gap-3"><div><p className="text-xs text-slate-500">{p.brand}</p><Link to={`/products/${p._id}`} className="font-bold line-clamp-1">{p.name}</Link></div><span className="flex items-center gap-1 text-amber-600 text-sm"><Star size={14} fill="currentColor"/> {p.ratings?.toFixed?.(1) || 0}</span></div><div className="flex items-end gap-2"><b className="text-xl">{money(p.discountPrice||p.price)}</b>{p.discountPrice&&<span className="line-through text-slate-400 text-sm">{money(p.price)}</span>}</div><div className="grid grid-cols-2 gap-2"><button onClick={()=>add(p._id)} className="btn-primary py-2"><ShoppingCart size={16}/> Add</button><button onClick={async()=>{await api.post('/users/wishlist/add',{productId:p._id}); toast.success('Wishlisted')}} className="btn-ghost py-2"><Heart size={16}/> Save</button></div></div></motion.div> }
