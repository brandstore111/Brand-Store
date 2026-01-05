
import React, { useState, useEffect } from 'react';
import { User, Product, Order, Shipment } from './types';
import AuthView from './AuthView';
import UserDashboard from './UserDashboard';
import ChatBot from './ChatBot';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'سماعة ايربودز برو', code: 'EP-001', price: 1200, cost: 900, quantity: 15, image: 'https://picsum.photos/400/400?random=1' },
    { id: '2', name: 'وصلة شحن سريعة', code: 'C-002', price: 150, cost: 80, quantity: 50, image: 'https://picsum.photos/400/400?random=2' },
    { id: '3', name: 'شاحن حائط 20 وات', code: 'W-003', price: 350, cost: 200, quantity: 30, image: 'https://picsum.photos/400/400?random=3' },
    { id: '4', name: 'فلاشة 64 جيجا', code: 'F-004', price: 250, cost: 150, quantity: 40, image: 'https://picsum.photos/400/400?random=4' },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'shaher-account',
      fullName: 'شاهر مجدي',
      nickname: 'شاهر',
      email: 'shahermagdee@gmail.com',
      phone: '01274790388',
      password: '#Agehn444',
      role: 'USER',
      userType: 'CUSTOMER',
      status: 'APPROVED',
      debt: 0
    },
    {
      id: 'test-user-1',
      fullName: 'زيكو البورسعيدي',
      nickname: 'زيكو',
      email: 'zico@test.com',
      phone: '01012345678',
      password: 'zico123',
      role: 'USER',
      userType: 'CUSTOMER',
      status: 'APPROVED',
      debt: 0
    }
  ]);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('brand_store_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user && user.role === 'USER') {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('brand_store_user');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('brand_store_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('brand_store_user');
  };

  return (
    <div className="min-h-screen bg-black flex justify-center overflow-hidden font-sans" dir="rtl">
      <div className="w-full max-w-[450px] h-screen bg-gray-950 relative shadow-[0_0_100px_rgba(37,99,235,0.15)] flex flex-col overflow-hidden border-x border-gray-800">
        {!isLoggedIn ? (
          <AuthView onLogin={handleLogin} users={users} setUsers={setUsers} />
        ) : (
          <UserDashboard 
            user={currentUser!} 
            onLogout={handleLogout} 
            products={products}
            orders={orders}
            setOrders={setOrders}
            shipments={shipments}
            setShipments={setShipments}
          />
        )}
        <ChatBot />
      </div>
    </div>
  );
};

export default App;
