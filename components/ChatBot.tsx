
import React, { useState, useRef, useEffect } from 'react';
import { getBotResponse } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPortSaidi, setIsPortSaidi] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const botMsg = await getBotResponse(userMsg, isPortSaidi);
    setMessages(prev => [...prev, { text: botMsg, sender: 'bot' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-gray-950 w-85 h-[500px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl mb-6 flex flex-col overflow-hidden border border-gray-800 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                <i className="fas fa-robot text-lg"></i>
              </div>
              <div>
                <p className="font-black text-sm tracking-tight">مساعد Brand Store</p>
                <div className="flex items-center gap-1">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                   <p className="text-[9px] text-blue-100 font-bold uppercase tracking-widest">جاهز للرد</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 transition flex items-center justify-center">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-black/40" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center text-gray-600 mt-20">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-comments text-3xl"></i>
                </div>
                <p className="text-sm font-bold">أهلاً بك! كيف يمكنني مساعدتك؟</p>
                <p className="text-[10px] mt-1 text-gray-500">اسأل عن الشحن، الطلبات، أو المتجر</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-none border border-gray-700">
                   <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="flex justify-center gap-3 mb-4">
               <button 
                 onClick={() => setIsPortSaidi(true)}
                 className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all border ${isPortSaidi ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-300'}`}
               >بورسعيدي</button>
               <button 
                 onClick={() => setIsPortSaidi(false)}
                 className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest transition-all border ${!isPortSaidi ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-300'}`}
               >لغة رسمية</button>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="اكتب استفسارك هنا..." 
                className="flex-1 p-3 bg-gray-800 text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm placeholder-gray-500 transition-all shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 active:scale-90 text-white w-12 h-12 rounded-2xl shadow-lg transition-all flex items-center justify-center shrink-0">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-16 h-16 rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(37,99,235,0.6)] flex items-center justify-center hover:scale-110 hover:-rotate-6 transition-all active:scale-95 border-2 border-white/20 relative"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-headset'} text-2xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
