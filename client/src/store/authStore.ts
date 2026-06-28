import { create } from 'zustand';
import { api } from '../services/api';
import { User } from '../types';
type State = { user?: User; loading: boolean; login: (email:string,password:string)=>Promise<void>; register:(name:string,email:string,password:string)=>Promise<void>; me:()=>Promise<void>; logout:()=>Promise<void> };
export const useAuth = create<State>((set)=>({ loading:false,
  login: async(email,password)=>{ set({loading:true}); const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('accessToken',data.accessToken); set({user:data.user,loading:false}); },
  register: async(name,email,password)=>{ const {data}=await api.post('/auth/register',{name,email,password}); localStorage.setItem('accessToken',data.accessToken); set({user:data.user}); },
  me: async()=>{ try{ const {data}=await api.get('/auth/me'); set({user:data.user}); }catch{} },
  logout: async()=>{ await api.post('/auth/logout'); localStorage.removeItem('accessToken'); set({user:undefined}); }
}));
