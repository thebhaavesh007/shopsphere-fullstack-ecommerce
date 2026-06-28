import { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
export default function Wishlist(){ const [items,setItems]=useState<any[]>([]); useEffect(()=>{api.get('/users/wishlist').then(r=>setItems(r.data.wishlist))},[]); return <main className="container py-10"><h1 className="text-4xl font-black">Wishlist</h1><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">{items.map(p=><ProductCard key={p._id} p={p}/>)}</div></main> }
