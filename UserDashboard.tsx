
import React, { useState } from 'react';
import { User, Product, Order, Shipment } from './types';
import { VODAFONE_CASH_NUM, ORANGE_CASH_NUM, TERMS_AND_CONDITIONS } from './constants';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  products: Product[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, onLogout, products, orders, setOrders, shipments, setShipments 
}) => {
  const [view, setView] = useState<'HOME' | 'STORE' | 'TRACKING' | 'PROFILE' | 'WALLET' | 'TERMS'>('HOME');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreateShipment = (type: string, amount: number, details: string) => {
    const newShipment: Shipment = {
      id: Math.random().toString(),
      userId: user.id,
      type,
      amount,
      profit: 3, 
      details,
      status: 'PENDING',
      timestamp: Date.now()
    };
    setShipments(prev => [newShipment, ...prev]);
    alert('تم إرسال طلب الشحن بنجاح! سيتم التنفيذ قريباً.');
    setView('TRACKING');
  };

  const handlePlaceOrder = (product: Product) => {
    const notes = prompt('أي ملاحظات على الطلب؟');
    const newOrder: Order = {
      id: Math.random().toString(),
      userId: user.id,
      productId: product.id,
      quantity: 1,
      status: 'PENDING',
      timestamp: Date.now(),
      location: 'GPS Detected',
      notes: notes || ''
    };
    setOrders(prev => [newOrder, ...prev]);
    alert('تم تسجيل طلبك للمنتج ' + product.name);
    setView('TRACKING');
  };

  const profileImage = user.profilePic || `https://picsum.photos/150/150?seed=${user.id}`;

  return (
    <div className="flex h-screen bg-black text-gray-100">
      {/* Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-gray-900 border-l border-gray-800 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="p-8 bg-gradient-to-br from-blue-700 to-indigo-900 flex flex-col items-center shrink-0">
          <div className="relative group">
            <img src={profileImage} className="w-24 h-24 rounded-3xl border-4 border-white/20 shadow-2xl mb-4 object-cover transform transition group-hover:scale-105" />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-gray-900 shadow-md"></div>
          </div>
          <h2 className="font-black text-xl text-white">{user.nickname}</h2>
          <div className="mt-2 flex flex-col items-center gap-1">
            <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">إجمالي المديونية</span>
            <span className="text-red-400 font-black text-lg">{user.debt} ج.م</span>
          </div>
          <span className="mt-3 text-[9px] bg-white/10 px-3 py-1 rounded-full font-black text-white/80 uppercase">{user.userType === 'REQUEST_CUSTOMER' ? 'عميل طلبات المميز' : 'عميل المتجر'}</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <MenuItem icon="fa-home" text="الرئيسية" active={view === 'HOME'} onClick={() => { setView('HOME'); setSidebarOpen(false); }} />
          <MenuItem icon="fa-shopping-bag" text="المتجر الإلكتروني" active={view === 'STORE'} onClick={() => { setView('STORE'); setSidebarOpen(false); }} />
          <MenuItem icon="fa-wallet" text="شحن ومحافظ" active={view === 'WALLET'} onClick={() => { setView('WALLET'); setSidebarOpen(false); }} />
          <MenuItem icon="fa-map-marker-alt" text="تتبع الطلبات" active={view === 'TRACKING'} onClick={() => { setView('TRACKING'); setSidebarOpen(false); }} />
          <MenuItem icon="fa-user-circle" text="الملف الشخصي" active={view === 'PROFILE'} onClick={() => { setView('PROFILE'); setSidebarOpen(false); }} />
          <MenuItem icon="fa-file-contract" text="الشروط" active={view === 'TERMS'} onClick={() => { setView('TERMS'); setSidebarOpen(false); }} />
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-black border border-red-400/20 active:scale-95">
            <i className="fas fa-sign-out-alt"></i>
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 p-4 shadow-xl flex items-center justify-between border-b border-gray-800 shrink-0">
          {view !== 'HOME' ? (
            <button onClick={() => setView('HOME')} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl text-blue-500 active:scale-90 transition-transform">
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-xl text-gray-300">
              <i className="fas fa-bars"></i>
            </button>
          )}
          
          <div className="flex items-center">
            <span className="text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]">
              Brand Store
            </span>
          </div>

          <div className="w-10"></div> {/* Spacer for alignment */}
        </header>

        <main className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-10">
          {view === 'HOME' && (
            <>
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/40">
                <div className="relative z-10">
                  <h1 className="text-3xl font-black mb-3">أهلاً يا {user.nickname}! 👋</h1>
                  <p className="text-blue-100/80 text-sm font-medium">كل ما تحتاجه من خدمات مالية في مكان واحد.</p>
                </div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              <section>
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><i className="fas fa-bolt text-yellow-500"></i> وصول سريع</h3>
                <div className="grid grid-cols-2 gap-4">
                  <QuickLink icon="fa-mobile-alt" label="شحن رصيد" color="blue" onClick={() => setView('WALLET')} />
                  <QuickLink icon="fa-university" label="إيداع ID" color="green" onClick={() => setView('WALLET')} />
                  <QuickLink icon="fa-credit-card" label="فيزا" color="purple" onClick={() => setView('WALLET')} />
                  <QuickLink icon="fa-shopping-cart" label="المتجر" color="orange" onClick={() => setView('STORE')} />
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black flex items-center gap-3"><i className="fas fa-fire text-red-500"></i> جديد المتجر</h3>
                  <button onClick={() => setView('STORE')} className="text-blue-400 hover:text-blue-300 font-black text-xs">الكل</button>
                </div>
                <div className="flex space-x-4 space-x-reverse overflow-x-auto pb-4 custom-scrollbar">
                  {products.slice(0, 5).map(p => (
                    <div key={p.id} className="min-w-[200px] bg-gray-900 rounded-[2rem] border border-gray-800 p-4 shadow-xl group">
                      <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3">
                        <img src={p.image} className="w-full h-full object-cover transition group-hover:scale-110" />
                      </div>
                      <p className="font-black text-sm text-white mb-1 truncate">{p.name}</p>
                      <p className="text-blue-400 font-black text-base mb-3">{p.price} ج.م</p>
                      <button onClick={() => handlePlaceOrder(p)} className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-2 rounded-xl text-[10px] font-black transition-all border border-blue-600/20">اطلب</button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {view === 'STORE' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-center text-blue-400">المتجر الإلكتروني</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden flex flex-col group shadow-xl">
                    <div className="relative h-32 w-full">
                      <img src={p.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-black text-xs mb-2 text-white line-clamp-1">{p.name}</h3>
                      <p className="text-sm font-black text-blue-400 mb-3">{p.price} ج.م</p>
                      <button onClick={() => handlePlaceOrder(p)} className="w-full bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black transition-all active:scale-95">شراء</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'WALLET' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black mb-2">الخدمات المالية</h2>
                <p className="text-gray-500 text-xs font-medium">اختر خدمتك وقم بملء البيانات</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <WalletCard title="شحن رصيد" icon="fa-mobile-alt" onAction={() => {
                  const num = prompt('أدخل رقم الموبايل:');
                  const val = Number(prompt('أدخل المبلغ:'));
                  if (num && val) handleCreateShipment('شحن رصيد', val, `رقم: ${num}`);
                }} />
                <WalletCard title="فودافون كاش" icon="fa-wallet" onAction={() => {
                  const action = confirm('هل تريد إيداع؟');
                  const val = Number(prompt('المبلغ:'));
                  if (action) {
                    const num = prompt('الرقم المراد شحنه:');
                    handleCreateShipment('إيداع فودافون كاش', val, `للرقم: ${num}`);
                  } else {
                    alert(`حول لـ ${VODAFONE_CASH_NUM}`);
                    handleCreateShipment('سحب فودافون كاش', val, 'سحب');
                  }
                }} />
                <WalletCard title="إيداع ID ألعاب" icon="fa-gamepad" onAction={() => {
                   const id = prompt('الـ ID:');
                   const val = Number(prompt('المبلغ:'));
                   if (id && val) handleCreateShipment('إيداع ID', val, `ID: ${id}`);
                }} />
              </div>
            </div>
          )}

          {view === 'TRACKING' && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-black mb-4 flex items-center gap-3"><i className="fas fa-box-open text-orange-500"></i> المتجر</h2>
                {orders.filter(o => o.userId === user.id).length === 0 ? <p className="text-gray-600 text-xs italic">لا توجد طلبات</p> : (
                  <div className="space-y-3">
                    {orders.filter(o => o.userId === user.id).map(o => (
                      <div key={o.id} className="bg-gray-900 p-4 rounded-2xl border-r-4 border-orange-500 border-l border-y border-gray-800 flex justify-between items-center shadow-lg">
                        <span className="text-xs font-black truncate max-w-[120px]">{products.find(p => p.id === o.productId)?.name}</span>
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black ${o.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-400'}`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <h2 className="text-xl font-black mb-4 flex items-center gap-3"><i className="fas fa-hand-holding-usd text-blue-500"></i> الشحن</h2>
                {shipments.filter(s => s.userId === user.id).length === 0 ? <p className="text-gray-600 text-xs italic">لا توجد شحنات</p> : (
                  <div className="space-y-3">
                    {shipments.filter(s => s.userId === user.id).map(s => (
                      <div key={s.id} className="bg-gray-900 p-4 rounded-2xl border-r-4 border-blue-500 border-l border-y border-gray-800 flex justify-between items-center shadow-lg">
                        <span className="text-xs font-black">{s.type}</span>
                        <span className="text-blue-400 font-black text-xs">{s.amount} ج.م</span>
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black ${s.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-400'}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {view === 'PROFILE' && (
            <div className="bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-800">
               <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-center relative overflow-hidden">
                   <img src={profileImage} className="w-24 h-24 rounded-2xl border-4 border-white/10 mx-auto mb-4 object-cover" />
                   <h2 className="text-xl font-black text-white">{user.fullName}</h2>
                   <p className="text-blue-200 text-sm font-bold">@{user.nickname}</p>
               </div>
               
               <div className="p-6 space-y-4">
                   <ProfileItem label="الاسم الرباعي" value={user.fullName} icon="fa-user" />
                   <ProfileItem label="رقم الجوال" value={user.phone} icon="fa-phone" />
                   <ProfileItem label="المديونية" value={`${user.debt} ج.م`} icon="fa-money-bill-wave" color="text-red-400" />
                   
                   <div className="mt-6 border-t border-gray-800 pt-6">
                     <h3 className="text-sm font-black mb-4 flex items-center gap-2"><i className="fas fa-id-card text-blue-500"></i> الهوية</h3>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="aspect-[3/2] bg-black/40 rounded-xl overflow-hidden border border-gray-800">
                         {user.idFrontPic && <img src={user.idFrontPic} className="w-full h-full object-cover" />}
                       </div>
                       <div className="aspect-[3/2] bg-black/40 rounded-xl overflow-hidden border border-gray-800">
                         {user.idBackPic && <img src={user.idBackPic} className="w-full h-full object-cover" />}
                       </div>
                     </div>
                   </div>
               </div>
            </div>
          )}

          {view === 'TERMS' && (
            <div className="bg-gray-900 rounded-[2rem] p-8 border border-gray-800">
              <h2 className="text-xl font-black mb-4 border-b border-gray-800 pb-4">الشروط والأحكام</h2>
              <div className="text-gray-400 text-xs leading-relaxed max-h-[50vh] overflow-y-auto custom-scrollbar">
                {TERMS_AND_CONDITIONS}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value, icon, color = 'text-gray-100' }: any) => (
  <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-gray-800">
    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 border border-blue-500/20">
      <i className={`fas ${icon} text-blue-500`}></i>
    </div>
    <div className="overflow-hidden">
      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
      <p className={`font-bold text-sm truncate ${color}`}>{value}</p>
    </div>
  </div>
);

const MenuItem = ({ icon, text, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-black ${active ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
  >
    <i className={`fas ${icon} w-6 text-center`}></i>
    <span className="flex-1 text-right text-sm">{text}</span>
  </button>
);

const QuickLink = ({ icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-xl active:scale-95 transition-all group"
  >
    <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 mb-2 border border-${color}-500/20`}>
      <i className={`fas ${icon} text-xl`}></i>
    </div>
    <span className="text-[10px] font-black uppercase text-gray-200">{label}</span>
  </button>
);

const WalletCard = ({ title, icon, onAction }: any) => (
  <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-xl flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
       <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
         <i className={`fas ${icon} text-blue-500 text-lg`}></i>
       </div>
       <span className="font-black text-sm text-gray-100">{title}</span>
    </div>
    <button onClick={onAction} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-blue-900/40 active:scale-95">بدء</button>
  </div>
);

export default UserDashboard;
