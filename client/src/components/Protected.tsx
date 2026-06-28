import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
export function Protected({children,admin=false}:{children:JSX.Element;admin?:boolean}){ const {user}=useAuth(); if(!user) return <Navigate to="/login"/>; if(admin && user.role!=='admin') return <Navigate to="/"/>; return children; }
