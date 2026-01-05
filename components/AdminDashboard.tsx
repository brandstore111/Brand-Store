
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
    return Math.random().toString(36).slice(-8).toUpperCase();
  };

  const approveUser = (id: string) => {
    const newPassword = generateRandomPassword();
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'APPROVED', password: newPassword } : u));
    alert(`تم قبول المستخدم بنجاح!\nكلمة المرور المؤقتة: ${newPassword}\nبرجاء إرسالها للعميل.`);
  };

  const rejectUser = (id: string) => {
    const reason = prompt('سبب الرفض:');
    if (reason) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'REJECTED', rejectionReason: reason } : u));
    }
  };

  const updateProductQuantity = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p));
  };

  const handleUpdateShipmentStatus = (id: string, newStatus: 'PROCESSING' | 'COMPLETED') => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const totalDebt = users.reduce((acc, u) => acc + (u.debt || 0), 0);
  const totalSales = shipments.filter(s => s.status === 'COMPLETED').reduce((acc, s) => acc + s.amount, 0);

  const StatCard = ({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: string }) => (
    <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-lg relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 -mr-8 -mt-8 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-all`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 bg-${color}-500/10 rounded-xl flex items-center justify-center mb-4 border border-${color}-500/20`}>
          <i className={`fas ${icon} text-${color}-500`}></i>
        </div>
        <p className="text-xs text-gray-500 font-black mb-1 uppercase tracking-widest">{title}</p>
        <h3 className={`text-2xl font-black ${color.startsWith('text') ? color : `text-${color}-400`}`}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-950 text-gray-100 relative">
      <header className="bg-gray-900 p-4 shadow-xl flex items-center justify-between border-b border-gray-800 shrink-0">
        <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl text-blue-500 border border-gray-700 active:scale-95 transition-all">
          <i className="fas fa-bars"></i>
        </button>
        <div className="flex items-center">
            <span className="text-lg font-black italic tracking-tighter text-blue-500 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]">Admin Panel</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 overflow-hidden shadow-lg">
            <img src={`https://picsum.photos/100/100?seed=${user.id}`} className="w-full h-full object-cover" alt="Admin" />
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-gray-950 z-[70] transform transition-transform duration-500 ease-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col border-l border-gray-800 shadow-2xl`}>
        <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-gradient-to-br from-gray-900 to-black">
            <div className="flex flex-col">
              <span className="text-blue-500 font-black text-xl">Brand Store</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">إدارة النظام</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 p-2 hover:text-white transition-colors"><i className="fas fa-times text-xl"></i></button>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-3">
          <NavButton icon="fa-chart-line" text="نظرة عامة" active={activeTab === 'OVERVIEW'} onClick={() => {setActiveTab('OVERVIEW'); setSidebarOpen(false);}} />
          <NavButton icon="fa-boxes" text="المخزون" active={activeTab === 'STOCK'} onClick={() => {setActiveTab('STOCK'); setSidebarOpen(false);}} />
          <NavButton icon="fa-users" text={`المستخدمين (${pendingUsers.length})`} active={activeTab === 'USERS'} onClick={() => {setActiveTab('USERS'); setSidebarOpen(false);}} />
          <NavButton icon="fa-truck-loading" text="الشحنات والطلبات" active={activeTab === 'SHIPMENTS'} onClick={() => {setActiveTab('SHIPMENTS'); setSidebarOpen(false);}} />
          <NavButton icon="fa-coins" text="الحسابات المالية" active={activeTab === 'FINANCE'} onClick={() => {setActiveTab('FINANCE'); setSidebarOpen(false);}} />
        </nav>
        <div className="p-6 border-t border-gray-800 bg-black/40">
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black border border-red-500/20 active:scale-95">
              <i className="fas fa-sign-out-alt"></i>
              <span>خروج آمن</span>
            </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-black/20">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="إجمالي المبيعات" value={`${totalSales} ج.م`} color="green" icon="fa-money-bill-wave" />
              <StatCard title="المديونيات" value={`${totalDebt} ج.م`} color="red" icon="fa-hand-holding-usd" />
              <StatCard title="المستخدمين" value={users.length} color="blue" icon="fa-users" />
              <StatCard title="الطلبات النشطة" value={shipments.filter(s => s.status !== 'COMPLETED').length} color="yellow" icon="fa-clock" />
            </div>
            <div className="bg-gray-900/50 p-6 rounded-[2rem] border border-gray-800 shadow-inner">
              <h4 className="font-black mb-4 text-gray-400 flex items-center gap-2">
                <i className="fas fa-history text-blue-500"></i> آخر العمليات
              </h4>
              <div className="space-y-3">
                {shipments.slice(0, 5).map(s => (
                  <div key={s.id} className="flex justify-between items-center text-[10px] p-4 bg-black/40 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-300">{s.type}</span>
                        <span className="text-gray-600">{new Date(s.timestamp).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <span className="font-black text-blue-500 text-sm">{s.amount} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'STOCK' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">إدارة المخزون</h2>
              <button onClick={() => alert('ميزة إضافة المنتج ستتاح قريباً في التحديث القادم!')} className="bg-blue-600 px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg shadow-blue-900/40 active:scale-95 transition-all">إضافة منتج</button>
            </div>
            <div className="grid gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-gray-900 p-4 rounded-3xl border border-gray-800 flex items-center gap-4 shadow-xl hover:border-gray-700 transition-all">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-gray-800">
                    <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-sm text-white mb-1">{p.name}</h4>
                    <p className="text-[10px] text-gray-500 mb-2">كود: {p.code}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">الكمية:</span>
                        <span className={`text-sm font-black ${p.quantity < 5 ? 'text-red-500' : 'text-green-400'}`}>{p.quantity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => updateProductQuantity(p.id, 1)} className="w-10 h-10 bg-gray-800 hover:bg-green-600/20 hover:text-green-400 rounded-xl flex items-center justify-center text-gray-400 transition-all border border-gray-700">+</button>
                    <button onClick={() => updateProductQuantity(p.id, -1)} className="w-10 h-10 bg-gray-800 hover:bg-red-600/20 hover:text-red-400 rounded-xl flex items-center justify-center text-gray-400 transition-all border border-gray-700">-</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-6 animate-in slide-in-from-left duration-500">
            <h2 className="text-xl font-black text-blue-500 flex items-center gap-3">
              <i className="fas fa-user-clock text-2xl"></i> طلبات التسجيل ({pendingUsers.length})
            </h2>
            {pendingUsers.length === 0 && (
              <div className="text-center text-gray-600 py-20 bg-gray-900/20 rounded-[3rem] border border-dashed border-gray-800">
                <i className="fas fa-check-circle text-5xl mb-4 text-gray-800"></i>
                <p className="text-sm font-bold">لا يوجد طلبات انتظار حالياً</p>
              </div>
            )}
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-gray-900 rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="relative">
                        <img src={u.profilePic || `https://picsum.photos/100/100?seed=${u.id}`} className="w-20 h-20 rounded-3xl object-cover border-4 border-blue-500/20" alt="Profile" />
                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-[8px] font-black px-2 py-1 rounded-lg">قيد المراجعة</div>
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-white">{u.fullName}</h4>
                      <p className="text-blue-400 text-sm font-bold">@{u.nickname}</p>
                      <p className="text-gray-500 text-[10px] mt-1"><i className="fas fa-phone mr-1"></i> {u.phone}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
                        <i className="fas fa-id-card text-blue-500"></i> مستندات الهوية
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group relative aspect-[3/2] bg-black/40 rounded-2xl overflow-hidden border border-gray-800 cursor-zoom-in">
                        {u.idFrontPic && <img src={u.idFrontPic} className="w-full h-full object-cover group-hover:scale-110 transition-all" />}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-white bg-blue-600 px-3 py-1 rounded-full">معاينة</span>
                        </div>
                      </div>
                      <div className="group relative aspect-[3/2] bg-black/40 rounded-2xl overflow-hidden border border-gray-800 cursor-zoom-in">
                        {u.idBackPic && <img src={u.idBackPic} className="w-full h-full object-cover group-hover:scale-110 transition-all" />}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-white bg-blue-600 px-3 py-1 rounded-full">معاينة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => approveUser(u.id)} className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-green-900/20 transition-all active:scale-95">موافقة الحساب</button>
                    <button onClick={() => rejectUser(u.id)} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-4 rounded-2xl font-black text-sm border border-red-600/30 transition-all active:scale-95">رفض الطلب</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SHIPMENTS' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <i className="fas fa-truck-moving text-orange-500"></i> طلبات الشحن النشطة
            </h2>
            {shipments.filter(s => s.status !== 'COMPLETED').length === 0 ? (
                <div className="text-center py-20 text-gray-600">لا يوجد طلبات نشطة حالياً</div>
            ) : (
                shipments.filter(s => s.status !== 'COMPLETED').map(s => (
                  <div key={s.id} className="bg-gray-900 p-6 rounded-[2.5rem] border-r-8 border-orange-500 border-l border-y border-gray-800 shadow-xl relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-blue-400 text-lg mb-1">{s.type}</h4>
                        <p className="text-[10px] text-gray-500"><i className="far fa-calendar-alt mr-1"></i> {new Date(s.timestamp).toLocaleString('ar-EG')}</p>
                      </div>
                      <span className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-xl text-xs font-black border border-orange-500/20">{s.amount} ج.م</span>
                    </div>
                    <div className="bg-black/30 p-4 rounded-2xl mb-6 border border-gray-800/50">
                        <p className="text-xs text-gray-400 font-bold mb-1">تفاصيل العميل والتحويل:</p>
                        <p className="text-sm text-gray-200 leading-relaxed">{s.details}</p>
                    </div>
                    <div className="flex gap-3">
                      {s.status === 'PENDING' && (
                        <button onClick={() => handleUpdateShipmentStatus(s.id, 'PROCESSING')} className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-900/30 transition-all active:scale-95">تغيير لـ جارِ التنفيذ</button>
                      )}
                      {s.status === 'PROCESSING' && (
                        <button onClick={() => handleUpdateShipmentStatus(s.id, 'COMPLETED')} className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-green-900/30 transition-all active:scale-95">تأكيد الإتمام النهائي</button>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {activeTab === 'FINANCE' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-xl font-black flex items-center gap-2"><i className="fas fa-coins text-yellow-500"></i> سجل المديونيات والتحصيل</h2>
            <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl">
              <div className="bg-gray-800/50 p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between px-8">
                  <span>العميل</span>
                  <span>المديونية</span>
              </div>
              {users.filter(u => (u.debt || 0) > 0).length === 0 ? (
                  <div className="p-10 text-center text-gray-600">لا يوجد مديونيات حالياً</div>
              ) : (
                  users.filter(u => (u.debt || 0) > 0).map(u => (
                    <div key={u.id} className="p-6 border-b border-gray-800 flex justify-between items-center last:border-0 hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 font-black border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {u.nickname.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-base text-gray-100">{u.fullName}</p>
                          <p className="text-[10px] text-gray-500">رقم: {u.phone}</p>
                        </div>
                      </div>
                      <div className="text-left flex flex-col items-end gap-2">
                        <p className="text-red-400 font-black text-lg">{u.debt} ج.م</p>
                        <button onClick={() => {
                          const pay = Number(prompt('المبلغ المراد تسويته من المديونية:'));
                          if (pay) setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, debt: Math.max(0, (usr.debt || 0) - pay) } : usr));
                        }} className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white px-4 py-1.5 rounded-full text-[9px] font-black transition-all border border-blue-500/20">تسوية سريعة</button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavButton = ({ icon, text, active, onClick }: { icon: string, text: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-black ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-white/20' : 'bg-gray-800'}`}>
      <i className={`fas ${icon} text-sm`}></i>
    </div>
    <span className="flex-1 text-right text-sm">{text}</span>
  </button>
);

export default AdminDashboard;
