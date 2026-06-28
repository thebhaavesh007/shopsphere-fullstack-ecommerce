import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, money } from '../services/api';
import { Order } from '../types';
export default function Orders(){ const [orders,setOrders]=useState<Order[]>([]); useEffect(()=>{api.get('/orders/my-orders').then(r=>setOrders(r.data.orders))},[]); return <main className="container py-10"><h1 className="text-4xl font-black">My Orders</h1><div className="space-y-4 mt-6">{orders.map(o=><Link to={`/orders/${o._id}`} className="card p-5 flex justify-between" key={o._id}><span>{new Date(o.createdAt).toLocaleDateString()} · {o.orderStatus}</span><b>{money(o.totalAmount)}</b></Link>)}</div></main> }
