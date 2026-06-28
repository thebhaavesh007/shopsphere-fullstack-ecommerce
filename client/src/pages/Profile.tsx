import { useAuth } from '../store/authStore';
export default function Profile(){ const {user}=useAuth(); return <main className="container py-10"><div className="card p-8 max-w-2xl"><h1 className="text-4xl font-black">Profile</h1><p className="mt-4"><b>Name:</b> {user?.name}</p><p><b>Email:</b> {user?.email}</p><p><b>Role:</b> {user?.role}</p></div></main> }
