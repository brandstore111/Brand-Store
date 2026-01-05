
import React, { useState } from 'react';
import { User, Product, Order, Shipment } from '../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, onLogout, products, setProducts, users, setUsers, orders, setOrders, shipments, setShipments 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STOCK' | 'USERS' | 'FINANCE' | 'SHIPMENTS'>('OVERVIEW');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingUsers = users.filter(u => u.status === 'PENDING');
  
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // Random 8 chars
  };

  const approveUser = (id: string) => {
    const newPassword = generateRandomPassword();
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'APPROVED', password: newPassword } : u));
    alert(`تم قبول المستخدم بنجاح!\nكلمة المرور المرسلة له: ${newPassword}\nبرجاء إبلاغه بها.`);
  };

  const rejectUser = (id: string, reason: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'REJECTED', rejectionReason: reason } : u));
  };

  const addProduct = () => {
    const name = prompt('اسم المنتج:');
    const price = Number(prompt('السعر:'));
    if (name && price) {
      const newProd: Product = {
        id: Math.random().toString(),
        name,
        code: 'P-' + Math.floor(Math.random() * 1000),
        price,
        cost: price * 0.8,
        quantity: 10,
        image: 'https://picsum.photos/400/400?random=' + Math.random()
      };
      setProducts(prev => [...prev, newProd]);
    }
  };

  const totalDebt = users.reduce((acc, u) => acc + u.debt, 0);
  const pendingShipmentsCount = shipments.filter(s => s.status === 'PENDING').length;
  const completedShipmentsTotal = shipments.filter(s => s.status === 'COMPLETED').reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-100 relative">
      <header className="bg-gray-900 p-4 shadow-xl flex items-center justify-between border-b border-gray-800 shrink-0">
        <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl text-gray-300">
          <i className="fas fa-bars"></i>
        </button>
        <div className="flex items-center">
            <span className="text-lg font-black italic tracking-tighter text-blue-500">Brand Store Admin</span>
        </div>
        <div className="w-10 h-10 rounded-full border border-yellow-500/50 overflow-hidden relative shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            <img src={`https://picsum.photos/100/100?seed=${user.fullName}`} className="w-full h-full object-cover" />
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 right-0 w-64 bg-gray-900 z-[70] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-gray-800`}>
        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between text-blue-500 font-bold">
            القائمة
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 p-2"><i className="fas fa-times"></i></button>
        </div>
        <nav className="flex-1 mt-4 px-3 space-y-2">
          <button onClick={() => {setActiveTab('OVERVIEW'); setSidebarOpen(false);}} className={`w-full text-right p-4 rounded-xl ${activeTab === 'OVERVIEW' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>نظرة عامة</button>
          <button onClick={() => {setActiveTab('STOCK'); setSidebarOpen(false);}} className={`w-full text-right p-4 rounded-xl ${activeTab === 'STOCK' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>المتجر</button>
          <button onClick={() => {setActiveTab('USERS'); setSidebarOpen(false);}} className={`w-full text-right p-4 rounded-xl ${activeTab === 'USERS' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>المستخدمين ({pendingUsers.length})</button>
          <button onClick={() => {setActiveTab('SHIPMENTS'); setSidebarOpen(false);}} className={`w-full text-right p-4 rounded-xl ${activeTab === 'SHIPMENTS' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>الشحنات</button>
          <button onClick={() => {setActiveTab('FINANCE'); setSidebarOpen(false);}} className={`w-full text-right p-4 rounded-xl ${activeTab === 'FINANCE' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>الماليات</button>
        </nav>
        <div className="p-4 border-t border-gray-800">
            <button onClick={onLogout} className="w-full text-red-500 p-3 rounded-xl border border-red-500/20">خروج</button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
               <p className="text-xs text-gray-500">إجمالي المبيعات</p>
               <h3 className="text-2xl font-black">{completedShipmentsTotal} ج.م</h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
               <p className="text-xs text-gray-500">إجمالي المديونيات</p>
               <h3 className="text-2xl font-black text-red-400">{totalDebt} ج.م</h3>
            </div>
          </div>
        )}
        {/* Additional tabs logic omitted for brevity, but imports are fixed */}
      </main>
    </div>
  );
};

export default AdminDashboard;
