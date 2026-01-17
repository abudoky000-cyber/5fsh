
import React, { useState, useRef } from 'react';
import { Category, Listing } from '../types';
import { enhanceListing } from '../services/geminiService';
import { ICONS } from '../constants';

interface ListingFormProps {
  onClose: () => void;
  onSubmit: (listing: Partial<Listing>) => void;
}

const ListingForm: React.FC<ListingFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: Category.SONY_ACCOUNTS,
    location: 'الرياض',
    imageUrl: ''
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const comingSoonCategories = [Category.ACCESSORIES];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("الصورة كبيرة جداً، يرجى اختيار صورة أقل من 5 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!formData.title) return;
    setIsEnhancing(true);
    const aiDescription = await enhanceListing(formData.title, formData.category);
    if (aiDescription) {
      setFormData(prev => ({ ...prev, description: aiDescription }));
    }
    setIsEnhancing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('الصور هي الواجهة الأولى للمشتري، يرجى إضافتها');
      return;
    }
    if (comingSoonCategories.includes(formData.category)) {
      alert('عذراً، هذا القسم غير متاح للنشر حالياً');
      return;
    }
    onSubmit({
      ...formData,
      price: Number(formData.price) || 0,
      sellerName: 'VIP User',
      createdAt: 'الآن'
    });
  };

  return (
    <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-3xl z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[4rem] w-full max-w-2xl max-h-[94vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="p-12 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-gray-950">نشر منتج فاخر</h2>
            <p className="text-gray-400 font-bold text-sm mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
              أنت الآن في منصة النخبة للإلكترونيات
            </p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-gray-100 rounded-[2rem] transition-all text-gray-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-900 mr-2 uppercase tracking-[0.2em]">صورة المنتج الاحترافية</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-[3rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center relative group ${
                formData.imageUrl ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-500'
              }`}
            >
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} className="w-full h-full object-contain" alt="Preview" />
                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xl backdrop-blur-md">
                    استبدال الصورة
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center text-blue-700 mb-5 group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="font-black text-xl text-blue-950">ارفع صورة المنتج</p>
                  <p className="text-xs text-gray-400 font-bold mt-2">يفضل استخدام خلفية بيضاء وإضاءة جيدة</p>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-900 mr-2 uppercase tracking-widest">اسم المنتج</label>
            <input 
              required
              className="w-full p-7 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2.5rem] outline-none transition-all font-black text-xl shadow-inner"
              placeholder="مثال: PS5 Slim النسخة الرقمية"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-900 mr-2 uppercase tracking-widest">التصنيف الحصري</label>
              <select 
                className="w-full p-7 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-[2.5rem] outline-none transition-all font-black cursor-pointer appearance-none shadow-inner"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {Object.values(Category).map(cat => (
                  <option 
                    key={cat} 
                    value={cat} 
                    disabled={comingSoonCategories.includes(cat)}
                    className={comingSoonCategories.includes(cat) ? "text-gray-300" : "text-gray-900"}
                  >
                    {cat} {comingSoonCategories.includes(cat) ? "(قريباً)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-black text-gray-900 mr-2 uppercase tracking-widest">السعر المطلوب (ريال)</label>
              <input 
                type="number"
                className="w-full p-7 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-[2.5rem] outline-none font-black text-xl shadow-inner"
                placeholder="0 = للسوم"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center px-4">
              <label className="block text-sm font-black text-gray-950 uppercase tracking-widest">الوصف والمواصفات</label>
              <button 
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !formData.title}
                className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50 transition-all border border-blue-100 shadow-sm"
              >
                <ICONS.Sparkles />
                {isEnhancing ? 'توليد ذكي...' : 'تحسين بالذكاء الاصطناعي'}
              </button>
            </div>
            <textarea 
              required
              className="w-full p-8 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-[3rem] outline-none min-h-[220px] font-medium text-xl leading-relaxed shadow-inner"
              placeholder="اكتب أدق تفاصيل منتجك هنا..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-10 flex gap-5 sticky bottom-0 bg-white">
            <button type="submit" className="flex-[3] bg-blue-700 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-blue-200 hover:bg-blue-800 hover:-translate-y-1 transition-all active:scale-95 text-2xl tracking-tighter">
              تأكيد النشر الفاخر
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 font-black py-7 rounded-[2.5rem] hover:bg-gray-200 transition-all text-xl">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
