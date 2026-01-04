
import React, { useState } from 'react';
import { User, CustomerType } from '../types';
import { TERMS_AND_CONDITIONS } from '../constants';

interface AuthViewProps {
  onLogin: (user: User) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, users, setUsers }) => {
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'PENDING'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('CUSTOMER');
  const [profilePic, setProfilePic] = useState<string>('');
  const [idFront, setIdFront] = useState<string>('');
  const [idBack, setIdBack] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthLogin = () => {
    const user = users.find(u => 
      (u.email === email || u.phone === email || u.phone === phone) && 
      u.status === 'APPROVED' && 
      u.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      const pendingUser = users.find(u => (u.email === email || u.phone === email || u.phone === phone) && u.status === 'PENDING');
      if (pendingUser) {
        setView('PENDING');
      } else {
        alert('بيانات غير صحيحة، أو الحساب لم يوافق عليه بعد، أو كلمة المرور خاطئة.');
      }
    }
  };

  const handleRegister = () => {
    if (!fullName || !nickname || !email || !phone) {
      alert('يرجى ملء جميع الخانات الأساسية');
      return;
    }
    if (!agreedToTerms) {
      alert('يجب الموافقة على الشروط والأحكام');
      return;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      nickname,
      email,
      phone,
      profilePic,
      idFrontPic: idFront,
      idBackPic: idBack,
      userType: customerType,
      role: 'USER',
      status: 'PENDING',
      debt: 0
    };
    setUsers(prev => [...prev, newUser]);
    setView('PENDING');
  };

  const inputClasses = "w-full p-4 bg-gray-900 text-white placeholder-gray-500 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm shadow-inner";
  const btnClasses = "w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.98] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all transform text-sm uppercase tracking-widest";

  return (
    <div className="h-full flex flex-col bg-gray-950 p-6 overflow-hidden">
      <header className="shrink-0 flex flex-col items-center justify-center mb-10 pt-6">
        <div className="flex w-full items-center justify-between mb-6">
          {view !== 'LOGIN' ? (
            <button onClick={() => setView('LOGIN')} className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded-2xl text-blue-500 border border-gray-800 active:scale-90 transition-transform shadow-lg">
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : <div className="w-12"></div>}
          <div className="w-12"></div>
        </div>
        
        {/* Stylish Glowing Text Banner */}
        <div className="text-center animate-in zoom-in-95 duration-1000 relative">
          <div className="px-8 py-5 bg-gray-900/40 backdrop-blur-2xl border border-blue-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5 animate-pulse"></div>
            <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 drop-shadow-[0_0_20px_rgba(37,99,235,0.7)]">
              Brand Store
            </h1>
          </div>
          <p className="text-blue-500/80 mt-4 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]">Financial & Smart Hub</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-1 space-y-6 pb-6">
        {view === 'LOGIN' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-4">
              <div className="relative">
                <i className="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="البريد الإلكتروني أو الهاتف" 
                  className={`${inputClasses} pr-12`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  className={`${inputClasses} pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleAuthLogin}
              className={btnClasses}
            >
              دخول العميل
            </button>
            <div className="flex justify-between text-[11px] px-2">
              <button onClick={() => setView('REGISTER')} className="text-blue-400 hover:text-blue-300 font-black underline underline-offset-8">حساب جديد</button>
              <button onClick={() => setView('FORGOT_PASSWORD')} className="text-gray-500 hover:text-gray-400 font-bold">نسيت كلمة السر؟</button>
            </div>
          </div>
        )}

        {view === 'REGISTER' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-6 duration-700">
            <input type="text" placeholder="الاسم الرباعي" className={inputClasses} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input type="text" placeholder="اسم الشهرة" className={inputClasses} value={nickname} onChange={(e) => setNickname(e.target.value)} />
            <input type="email" placeholder="البريد الإلكتروني" className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" placeholder="رقم الهاتف" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} />

            <div className="space-y-3 p-4 bg-gray-900 border border-gray-800 rounded-2xl shadow-inner">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">نوع العضوية</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" className="w-4 h-4 accent-blue-600" checked={customerType === 'CUSTOMER'} onChange={() => setCustomerType('CUSTOMER')} />
                  <span className="text-[12px] font-bold text-gray-300 group-hover:text-white transition">عميل</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" className="w-4 h-4 accent-blue-600" checked={customerType === 'REQUEST_CUSTOMER'} onChange={() => setCustomerType('REQUEST_CUSTOMER')} />
                  <span className="text-[12px] font-bold text-gray-300 group-hover:text-white transition">عميل طلبات</span>
                </label>
              </div>
            </div>

            <div className="space-y-3 bg-gray-900 p-4 rounded-2xl border border-gray-800">
              <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">المستندات والصور</label>
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-500 mr-2">الصورة الشخصية</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfilePic)} className="text-[10px] text-gray-400 file:ml-3 file:py-1 file:px-4 file:rounded-full file:bg-blue-600/10 file:text-blue-500 file:border-0 file:font-black" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-500 mr-2">البطاقة (أمام)</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdFront)} className="text-[10px] text-gray-400 file:ml-3 file:py-1 file:px-4 file:rounded-full file:bg-blue-600/10 file:text-blue-500 file:border-0 file:font-black" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-500 mr-2">البطاقة (خلف)</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdBack)} className="text-[10px] text-gray-400 file:ml-3 file:py-1 file:px-4 file:rounded-full file:bg-blue-600/10 file:text-blue-500 file:border-0 file:font-black" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/50 border border-gray-900 rounded-2xl text-[10px] h-28 overflow-y-auto text-gray-500 leading-relaxed custom-scrollbar shadow-inner">
              {TERMS_AND_CONDITIONS}
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-2">
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-4 h-4 rounded-md accent-blue-600" />
              <span className="text-[11px] text-gray-400 font-bold">أوافق على سياسات Brand Store</span>
            </label>
            <button onClick={handleRegister} className={btnClasses}>إنشاء حسابي الآن</button>
          </div>
        )}

        {view === 'PENDING' && (
          <div className="text-center space-y-8 py-16 animate-in zoom-in-95 duration-700">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
              <div className="relative text-7xl text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <i className="fas fa-hourglass-half animate-pulse"></i>
              </div>
            </div>
            <div className="space-y-4 px-4">
              <h2 className="text-2xl font-black text-white">تحت المراجعة</h2>
              <p className="text-gray-500 text-xs leading-relaxed font-bold">
                يا بطل.. إحنا بنراجع بياناتك وصور البطاقة عشان نضمن أمان حسابك وعملياتك. الموضوع مش بياخد أكتر من 24 ساعة.
              </p>
            </div>
            <button onClick={() => setView('LOGIN')} className={btnClasses}>العودة للرئيسية</button>
          </div>
        )}

        {view === 'FORGOT_PASSWORD' && (
          <div className="space-y-8 text-center py-10 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center mx-auto border border-blue-600/20 shadow-xl">
               <i className="fas fa-key text-3xl text-blue-500"></i>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">نسيت كلمة السر؟</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">أدخل بريدك لاستعادة الحساب</p>
            </div>
            <input type="email" placeholder="بريدك الإلكتروني" className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={() => { alert('تم إرسال كود الاستعادة.. شيك على إيميلك يا غالي'); setView('LOGIN'); }} className={btnClasses}>استعادة الآن</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
