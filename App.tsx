
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Listing } from './types';
import { ICONS, APP_NAME } from './constants';
import ListingCard from './components/ListingCard';
import ListingForm from './components/ListingForm';

const App: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('electro_premium_v1');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل'>('الكل');
  const [showForm, setShowForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const comingSoonCategories = [Category.ACCESSORIES];

  useEffect(() => {
    localStorage.setItem('electro_premium_v1', JSON.stringify(listings));
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [listings, searchQuery, selectedCategory]);

  const handleAddListing = (newListing: Partial<Listing>) => {
    const listingToAdd: Listing = {
      ...newListing,
      id: Date.now().toString(),
      createdAt: 'الآن',
      location: newListing.location || 'الرياض'
    } as Listing;
    setListings([listingToAdd, ...listings]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen pb-40 bg-[#f8fafc]">
      {/* Premium Navbar */}
      <nav className="bg-white/90 backdrop-blur-2xl border-b sticky top-0 z-50 px-4 shadow-sm h-20">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {setSelectedCategory('الكل'); setSearchQuery('');}}>
            <div className="w-11 h-11 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">E</div>
            <div>
              <h1 className="text-xl font-black text-blue-950 tracking-tighter leading-none">إليكترو بريميوم</h1>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Exclusive Tech Hub</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative group hidden md:block">
            <input 
              type="text" 
              placeholder="ابحث عن نخبة الأجهزة والحسابات..."
              className="w-full bg-gray-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-3.5 pr-12 pl-6 transition-all outline-none font-bold text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-blue-600">
              <ICONS.Search />
            </div>
          </div>

          <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-blue-100 transition-all">
            <ICONS.User />
          </button>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="relative h-[300px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Gaming Gear Premium"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-20 text-white">
            <span className="bg-blue-600 w-fit px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] mb-4">اختيار المحترفين</span>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">عالم سوني <br/><span className="text-blue-400">بين يديك.</span></h2>
            <p className="text-gray-200 max-w-md font-bold text-sm md:text-lg leading-relaxed mb-8 opacity-90">
              أكبر تجمع متخصص لبيع وشراء حسابات سوني، أجهزة البلايستيشن، والقطع الأصلية بأمان تام.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowForm(true)} className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">ابدأ البيع الآن</button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/20 transition-all">استكشف العروض</button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-auto whitespace-nowrap scroll-smooth">
        <div className="flex gap-3">
          <button 
            onClick={() => setSelectedCategory('الكل')}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-sm ${selectedCategory === 'الكل' ? 'bg-blue-700 text-white scale-105' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
          >
            الكل
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => !comingSoonCategories.includes(cat) && setSelectedCategory(cat)}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 border shadow-sm ${
                selectedCategory === cat 
                  ? 'bg-blue-700 text-white border-blue-700 scale-105' 
                  : comingSoonCategories.includes(cat)
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'
              }`}
            >
              {cat}
              {comingSoonCategories.includes(cat) && (
                <span className="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-black">قريباً</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <span className="w-2.5 h-10 bg-blue-700 rounded-full"></span>
            {selectedCategory === 'الكل' ? 'المعروض حالياً' : `قسم ${selectedCategory}`}
          </h2>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-bold text-gray-400 text-sm">
            {filteredListings.length} منتج حصري
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map(item => (
              <ListingCard key={item.id} listing={item} onClick={setSelectedListing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[4rem] py-40 text-center border-4 border-dashed border-gray-100 shadow-inner">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-800">لم يتم إضافة منتجات بعد</h3>
            <p className="text-gray-400 font-bold mt-2">كن المتميز الأول واعرض منتجك الآن</p>
          </div>
        )}
      </main>

      {/* Sony Floating Button */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
        <div className="relative">
          <div className="absolute -right-14 -top-24 w-32 h-32 animate-float pointer-events-none md:block hidden">
            <img src="https://m.media-amazon.com/images/I/51051HiS9OL._SL1143_.jpg" className="w-full h-full object-contain drop-shadow-2xl" alt="PS5" />
          </div>
          <div className="absolute -left-14 -top-16 w-24 h-24 animate-float-slow -rotate-12 pointer-events-none md:block hidden">
            <img src="https://m.media-amazon.com/images/I/6127p8S0s+L._SL1500_.jpg" className="w-full h-full object-contain drop-shadow-2xl" alt="Controller" />
          </div>

          <button 
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-700 text-white font-black py-7 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(29,78,216,0.6)] hover:bg-blue-800 hover:-translate-y-2 transition-all active:scale-95 flex items-center justify-center gap-4 border-4 border-white"
          >
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
              <ICONS.Plus />
            </div>
            <span className="text-2xl tracking-tighter uppercase">إضافة منتج فاخر</span>
          </button>
        </div>
      </div>

      {showForm && <ListingForm onClose={() => setShowForm(false)} onSubmit={handleAddListing} />}

      {/* Details View */}
      {selectedListing && (
        <div className="fixed inset-0 bg-blue-950/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] w-full max-w-6xl max-h-[94vh] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row animate-in zoom-in duration-500">
            <button onClick={() => setSelectedListing(null)} className="absolute top-10 left-10 p-4 bg-gray-100/80 hover:bg-white text-gray-700 rounded-full z-20 transition-all shadow-xl hover:rotate-90">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="lg:w-3/5 bg-[#f8fafc] flex items-center justify-center h-[400px] lg:h-auto overflow-hidden relative">
              <img src={selectedListing.imageUrl} className="w-full h-full object-contain p-16 transition-transform duration-1000 hover:scale-110" alt={selectedListing.title} />
              <div className="absolute top-10 right-10 flex gap-3">
                <span className="bg-white/90 backdrop-blur-md border border-gray-100 px-5 py-2 rounded-2xl text-[10px] font-black shadow-sm text-blue-700 uppercase tracking-widest">Premium Product</span>
              </div>
            </div>

            <div className="lg:w-2/5 p-12 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col bg-white">
              <div className="flex items-center gap-3 mb-10">
                <span className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100">
                  {selectedListing.category}
                </span>
                <span className="text-gray-400 font-bold text-xs flex items-center gap-1.5 border border-gray-100 px-4 py-2 rounded-xl">
                  <ICONS.Location /> {selectedListing.location}
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-black text-gray-950 mb-8 leading-[1.1] tracking-tighter">{selectedListing.title}</h2>
              
              <div className="bg-blue-50/50 rounded-[2.5rem] p-10 mb-10 border border-blue-100/50">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">القيمة المطلوبة</span>
                <div className="text-6xl font-black text-blue-800 flex items-baseline gap-3">
                  {selectedListing.price === 0 ? 'على السوم' : (
                    <>
                      <span>{selectedListing.price.toLocaleString()}</span>
                      <span className="text-2xl font-bold">ريال</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 mb-12">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-50 pb-4">مواصفات وتفاصيل حصرية</h4>
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed font-medium text-lg lg:text-xl">
                  {selectedListing.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 sticky bottom-0 bg-white pt-8">
                <button className="bg-[#25D366] text-white font-black py-7 rounded-[2rem] shadow-2xl shadow-green-100 hover:scale-[1.03] transition-all flex items-center justify-center gap-3 text-xl">
                  واتساب
                </button>
                <button className="bg-gray-950 text-white font-black py-7 rounded-[2rem] hover:bg-black transition-all flex items-center justify-center text-xl">
                  اتصال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
