
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

  // Financial Summary Logic
  const totalDebt = users.reduce((acc, u) => acc + u.debt, 0);
  const pendingShipmentsCount = shipments.filter(s => s.status === 'PENDING').length;
  const completedShipmentsTotal = shipments.filter(s => s.status === 'COMPLETED').reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-100 relative">
      {/* Top Header */}
      <header className="bg-gray-900 p-4 shadow-xl flex items-center justify-between border-b border-gray-800 shrink-0">
        {activeTab !== 'OVERVIEW' ? (
          <button onClick={() => setActiveTab('OVERVIEW')} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl text-blue-500 active:scale-90 transition-transform">
            <i className="fas fa-arrow-right"></i>
          </button>
        ) : (
          <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl text-gray-300">
            <i className="fas fa-bars"></i>
          </button>
        )}
        
        {/* Brand Logo Header */}
        <div className="flex items-center">
          <img 
            src="https://img.freepik.com/premium-photo/3d-logo-design-your-brand-brand-store-written-with-blue-white-colors-creative-logo_1260462-10.jpg" 
            alt="Logo" 
            className="h-8 w-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="w-10 h-10 rounded-full border border-yellow-500/50 overflow-hidden relative shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            <img src={`https://picsum.photos/100/100?seed=${user.fullName}`} className="w-full h-full object-cover" />
            <span className="absolute -top-1 -left-1 bg-yellow-500 text-[6px] px-1 rounded font-black text-black">ADM</span>
        </div>
      </header>

      {/* Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`fixed inset-y-0 right-0 w-64 bg-gray-900 z-[70] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-gray-800`}>
        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
            <img src="https://img.freepik.com/premium-photo/3d-logo-design-your-brand-brand-store-written-with-blue-white-colors-creative-logo_1260462-10.jpg" className="h-6 w-auto" />
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 p-2"><i className="fas fa-times"></i></button>
        </div>
        <nav className="flex-1 mt-4 px-3 overflow-y-auto custom-scrollbar">
          <SidebarItem icon="fa-chart-pie" text="نظرة عامة" active={activeTab === 'OVERVIEW'} onClick={() => {setActiveTab('OVERVIEW'); setSidebarOpen(false);}} open={true} />
          <SidebarItem icon="fa-box" text="المتجر" active={activeTab === 'STOCK'} onClick={() => {setActiveTab('STOCK'); setSidebarOpen(false);}} open={true} />
          <SidebarItem icon="fa-users" text="المستخدمين" active={activeTab === 'USERS'} onClick={() => {setActiveTab('USERS'); setSidebarOpen(false);}} open={true} badge={pendingUsers.length} />
          <SidebarItem icon="fa-shipping-fast" text="الشحنات" active={activeTab === 'SHIPMENTS'} onClick={() => {setActiveTab('SHIPMENTS'); setSidebarOpen(false);}} open={true} badge={pendingShipmentsCount} />
          <SidebarItem icon="fa-wallet" text="الماليات" active={activeTab === 'FINANCE'} onClick={() => {setActiveTab('FINANCE'); setSidebarOpen(false);}} open={true} />
        </nav>
        <div className="p-4 border-t border-gray-800">
            <button onClick={onLogout} className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 border border-red-500/20">
                <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
            </button>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard label="إجمالي المبيعات" value={`${completedShipmentsTotal} ج.م`} icon="fa-shopping-cart" color="blue" />
            <StatCard label="إجمالي المديونيات" value={`${totalDebt} ج.م`} icon="fa-hand-holding-usd" color="red" />
            <StatCard label="المستخدمين النشطين" value={users.length.toString()} icon="fa-user-check" color="purple" />
          </div>
        )}

        {activeTab === 'STOCK' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black text-blue-400">إدارة المتجر</h2>
              <button onClick={addProduct} className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-bold transition shadow-lg shadow-blue-900/40">
                <i className="fas fa-plus"></i> إضافة منتج
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-gray-900/50 p-4 rounded-3xl border border-gray-800 flex items-center gap-4 shadow-xl">
                  <img src={p.image} className="h-16 w-16 object-cover rounded-2xl shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm truncate">{p.name}</h3>
                    <p className="text-blue-400 font-black text-sm">{p.price} ج.م</p>
                    <p className="text-[10px] text-gray-500 font-bold">كود: {p.code} | كمية: {p.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'SHIPMENTS' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-blue-400">تتبع الشحنات</h2>
            
            <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-black text-blue-400 mb-1">العمليات المعلقة</h3>
                        <p className="text-3xl font-black">{pendingShipmentsCount}</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                        <i className="fas fa-truck-loading text-2xl text-blue-500 animate-bounce"></i>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
            </div>

            <div className="bg-gray-900/40 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
               <table className="w-full text-right text-xs">
                 <thead className="bg-white/5">
                   <tr>
                     <th className="p-4 font-bold uppercase tracking-widest text-[10px]">العميل</th>
                     <th className="p-4 font-bold text-center uppercase tracking-widest text-[10px]">المبلغ</th>
                     <th className="p-4 font-bold text-center uppercase tracking-widest text-[10px]">الحالة</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800">
                   {shipments.map(s => (
                     <tr key={s.id} className="hover:bg-white/5 transition">
                       <td className="p-4">
                         <div className="font-black text-white">{users.find(u => u.id === s.userId)?.nickname || 'عميل'}</div>
                         <div className="text-[9px] text-gray-500 font-bold">{s.type}</div>
                       </td>
                       <td className="p-4 text-center font-black text-blue-400">{s.amount} ج.م</td>
                       <td className="p-4 text-center">
                         <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-sm ${s.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                           {s.status === 'COMPLETED' ? 'تم' : 'جارٍ'}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}
        
        {activeTab === 'FINANCE' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-10">
            <h2 className="text-xl font-black text-blue-400">الإدارة المالية والمديونيات</h2>
            
            {/* Detailed Financial Illustration Style Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-black p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
               
               <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">المحفظة الرقمية</p>
                          <h3 className="text-3xl font-black text-white">{completedShipmentsTotal} <span className="text-sm text-gray-400">ج.م</span></h3>
                      </div>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover:rotate-12 transition-transform">
                          <i className="fas fa-wallet text-xl text-blue-500"></i>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase mb-1">المديونيات المعلقة</p>
                          <p className="text-lg font-black text-red-400">{totalDebt} ج.م</p>
                      </div>
                      <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase mb-1">التسويات اليومية</p>
                          <p className="text-lg font-black text-green-400">-- ج.م</p>
                      </div>
                  </div>

                  <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-[8px] font-black text-blue-400">60% نمو</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800 shadow-xl">
                 <h3 className="text-xs font-black mb-6 border-b border-gray-800 pb-3 uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <i className="fas fa-users-cog text-blue-500"></i> مديونيات العملاء
                 </h3>
                 <div className="space-y-3">
                   {users.filter(u => u.debt > 0).length === 0 ? (
                     <p className="text-gray-600 text-xs italic text-center py-4">لا توجد مديونيات حالية</p>
                   ) : (
                     users.filter(u => u.debt > 0).map(u => (
                       <div key={u.id} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500/20 transition group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                               <i className="fas fa-user-clock text-red-400 text-[10px]"></i>
                            </div>
                            <span className="text-xs font-black">{u.nickname}</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-red-400 font-black text-sm">{u.debt} ج.م</span>
                            <button className="text-[8px] bg-blue-600 text-white px-3 py-1 rounded-full font-black shadow-lg shadow-blue-900/20 active:scale-90 transition opacity-0 group-hover:opacity-100">سدد</button>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>

               <div className="bg-gray-900/60 p-6 rounded-3xl border border-gray-800 shadow-xl space-y-6">
                 <h3 className="text-xs font-black border-b border-gray-800 pb-3 uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <i className="fas fa-cog text-blue-500"></i> إعدادات الربح
                 </h3>
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-xs font-black">نسبة العمولة</p>
                        <p className="text-[10px] text-gray-500">تطبق على جميع عمليات الشحن</p>
                    </div>
                    <div className="relative">
                        <input type="text" className="w-20 p-2 bg-gray-800 border border-gray-700 rounded-xl text-center text-white font-black text-sm shadow-inner" defaultValue="3%" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_5px_blue]"></div>
                    </div>
                 </div>
                 <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-900/40 active:scale-95 transition">حفظ الإعدادات الجديدة</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black text-blue-400">طلبات الانضمام</h2>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-600 text-center py-10 text-sm italic font-bold">لا توجد طلبات معلقة حالياً</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map(u => (
                  <div key={u.id} className="bg-gray-900/50 p-5 rounded-[2rem] border border-gray-800 space-y-5 shadow-2xl transition hover:border-gray-700">
                    <div className="flex items-center gap-4">
                      <img src={u.profilePic || `https://picsum.photos/100/100?seed=${u.id}`} className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-800 shadow-lg" />
                      <div>
                        <h3 className="font-black text-sm">{u.fullName}</h3>
                        <p className="text-blue-400 text-xs font-black">@{u.nickname}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative group">
                           {u.idFrontPic ? <img src={u.idFrontPic} className="w-full h-full object-cover group-hover:scale-110 transition" /> : <div className="text-[8px] text-center flex items-center justify-center h-full text-gray-600 uppercase font-black">البطاقة (أمام)</div>}
                        </div>
                        <div className="aspect-video bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative group">
                           {u.idBackPic ? <img src={u.idBackPic} className="w-full h-full object-cover group-hover:scale-110 transition" /> : <div className="text-[8px] text-center flex items-center justify-center h-full text-gray-600 uppercase font-black">البطاقة (خلف)</div>}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => approveUser(u.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-green-900/20 active:scale-95 transition">قبول</button>
                        <button onClick={() => rejectUser(u.id, 'بيانات غير كافية')} className="flex-1 bg-red-600/10 text-red-500 py-3 rounded-2xl text-xs font-black border border-red-500/20 hover:bg-red-600/20 transition">رفض</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, onClick, open, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center p-4 my-2 rounded-2xl transition-all duration-300 font-black relative group ${active ? 'bg-blue-600 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)]' : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'}`}
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-white/20' : 'bg-gray-800 group-hover:bg-gray-700'}`}>
        <i className={`fas ${icon} text-sm`}></i>
    </div>
    <span className="mr-4 flex-1 text-right text-xs uppercase tracking-tight">{text}</span>
    {badge > 0 && <span className="absolute left-4 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow-lg shadow-red-900/40 animate-pulse">{badge}</span>}
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>}
  </button>
);

const StatCard = ({ label, value, icon, color }: any) => {
  const colorMap: any = {
    blue: 'from-blue-600/20 to-blue-500/5 text-blue-500 border-blue-500/20',
    red: 'from-red-600/20 to-red-500/5 text-red-500 border-red-500/20',
    purple: 'from-purple-600/20 to-purple-500/5 text-purple-500 border-purple-500/20',
    green: 'from-green-600/20 to-green-500/5 text-green-500 border-green-500/20'
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} p-6 rounded-[2.5rem] border flex items-center justify-between shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]`}>
      <div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-white">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-3xl bg-black/20 flex items-center justify-center border border-white/5 shadow-inner`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
    </div>
  );
};

export default AdminDashboard;
