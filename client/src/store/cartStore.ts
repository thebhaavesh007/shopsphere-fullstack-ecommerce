import { create } from 'zustand';
import toast from 'react-hot-toast';
import { api } from '../services/api';
type State = { cart:any; load:()=>Promise<void>; add:(productId:string,quantity?:number)=>Promise<void>; update:(productId:string,quantity:number)=>Promise<void>; remove:(id:string)=>Promise<void> };
export const useCart = create<State>((set,get)=>({ cart:{items:[]}, load:async()=>{ const {data}=await api.get('/cart'); set({cart:data.cart}); }, add:async(productId,quantity=1)=>{ await api.post('/cart/add',{productId,quantity}); toast.success('Added to cart'); await get().load(); }, update:async(productId,quantity)=>{ const {data}=await api.put('/cart/update',{productId,quantity}); set({cart:data}); }, remove:async(id)=>{ const {data}=await api.delete(`/cart/remove/${id}`); set({cart:data}); } }));
