
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

  // الأقسام المجدولة مستقبلاً
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
      alert('يرجى إضافة صورة للمنتج أولاً لضمان سرعة البيع');
      return;
    }
    if (comingSoonCategories.includes(formData.category)) {
      alert('هذا القسم سيفتح قريباً لاستقبال إعلاناتكم');
      return;
    }
    onSubmit({
      ...formData,
      price: Number(formData.price) || 0,
      sellerName: 'مستخدم',
      createdAt: 'الآن'
    });
  };

  return (
    <div className="fixed inset-0 bg-blue-950/70 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3.5rem] w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-3xl font-black text-gray-900">نشر إعلان</h2>
            <p className="text-gray-400 font-bold text-sm mt-1">املاً البيانات واعرض سلعتك فوراً</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-gray-100 rounded-3xl transition-all text-gray-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Photo Dropzone */}
          <div className="space-y-4">
            <label className="block text-sm font-black text-gray-800 mr-2">صورة المنتج الرئيسية</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-[16/9] rounded-[2.5rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center relative group ${
                formData.imageUrl ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'
              }`}
            >
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} className="w-full h-full object-contain" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-lg backdrop-blur-sm">
                    تغيير الصورة
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <p className="font-black text-xl text-blue-900">اضغط هنا لإضافة صورة</p>
                  <p className="text-xs text-gray-400 font-bold mt-2">يفضل صور واضحة من تصويرك الخاص</p>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-black text-gray-800 mr-2">عنوان الإعلان</label>
            <input 
              required
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
              placeholder="مثال: حساب سوني 5 فيه كود 20 وحزمة نادرة"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-800 mr-2">القسم</label>
              <select 
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-3xl outline-none transition-all font-black cursor-pointer appearance-none"
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
            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-800 mr-2">السعر (ريال)</label>
              <input 
                type="number"
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-3xl outline-none font-black text-lg"
                placeholder="اتركه 0 للسوم"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="block text-sm font-black text-gray-800">تفاصيل السلعة</label>
              <button 
                type="button"
                onClick={handleEnhance}
                disabled={isEnhancing || !formData.title}
                className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-100 disabled:opacity-50 transition-all border border-blue-100"
              >
                <ICONS.Sparkles />
                {isEnhancing ? 'جاري التحليل...' : 'تحسين بالذكاء الاصطناعي'}
              </button>
            </div>
            <textarea 
              required
              className="w-full p-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-3xl outline-none min-h-[160px] font-medium text-lg"
              placeholder="اكتب مواصفات الحساب أو الجهاز، تاريخ الشراء، وحالته حالياً..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-6 flex gap-4 sticky bottom-0 bg-white">
            <button type="submit" className="flex-[3] bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 text-xl">
              تأكيد ونشر الإعلان
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-500 font-black py-6 rounded-[2rem] hover:bg-gray-200 transition-all text-xl">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
