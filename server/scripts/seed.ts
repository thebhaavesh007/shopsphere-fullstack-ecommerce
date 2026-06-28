import dotenv from 'dotenv';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Category from '../src/models/Category';
import Order from '../src/models/Order';
import Product from '../src/models/Product';
import User from '../src/models/User';
dotenv.config();
const img = (id: number) => `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop&seed=${id}`;
async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere');
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Category.deleteMany({}), Order.deleteMany({})]);
  const cats = await Category.insertMany(['Electronics','Fashion','Shoes','Watches','Home Decor','Beauty','Accessories'].map(n => ({ name: n, slug: slugify(n,{lower:true}), image: img(n.length), description: `${n} premium collection` })));
  const admin = await User.create({ name: 'Admin User', email: 'admin@shopsphere.dev', password: 'Admin@12345', role: 'admin' });
  const users = await User.insertMany(Array.from({length:5}).map((_,i)=>({ name:`User ${i+1}`, email:`user${i+1}@shopsphere.dev`, password:'User@12345', role:'customer' })));
  const products = [];
  for (let i=1;i<=30;i++) {
    const cat = cats[i % cats.length];
    products.push({ name: `${cat.name} Pro Item ${i}`, slug: `product-${i}`, description: `Premium ${cat.name.toLowerCase()} product with modern quality, reliable performance, and stylish design.`, price: 499 + i*120, discountPrice: i%3===0 ? 399 + i*110 : undefined, category: cat._id, brand: ['Nova','UrbanX','Aero','Zenith'][i%4], images: [img(i), img(i+100)], stock: 10+i, ratings: 3.5+(i%15)/10, reviewsCount: i%8, isFeatured: i%5===0, variants: [{ name:'Color', value: ['Black','White','Blue'][i%3], stock: 5, price: 499+i*120 }] });
  }
  const saved = await Product.insertMany(products);
  await Order.create({ userId: users[0]._id, items: [{ productId: saved[0]._id, name: saved[0].name, image: saved[0].images[0], quantity: 2, price: saved[0].price }], shippingAddress: { city: 'Jaipur', state: 'Rajasthan' }, paymentMethod:'cod', paymentStatus:'pending', orderStatus:'Processing', totalAmount: saved[0].price*2, taxAmount: 0, shippingAmount: 0, discountAmount: 0 });
  console.log('Seed complete:', { admin: admin.email, users: users.length, products: saved.length });
  await mongoose.disconnect();
}
run().catch(e=>{ console.error(e); process.exit(1); });
