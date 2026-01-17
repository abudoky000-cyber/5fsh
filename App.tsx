
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Listing } from './types';
import { ICONS, APP_NAME } from './constants';
import ListingCard from './components/ListingCard';
import ListingForm from './components/ListingForm';

const App: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('electro_listings_v3');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل'>('الكل');
  const [showForm, setShowForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // الأقسام التي تظهر كـ "قريباً"
  const comingSoonCategories = [Category.ACCESSORIES];

  useEffect(() => {
    localStorage.setItem('electro_listings_v3', JSON.stringify(listings));
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
      createdAt: 'اليوم',
      location: newListing.location || 'الرياض'
    } as Listing;
    setListings([listingToAdd, ...listings]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen pb-40 bg-[#f8fafc]">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setSelectedCategory('الكل'); setSearchQuery('');}}>
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">E</div>
            <h1 className="text-xl font-black text-blue-900 tracking-tighter hidden md:block">إليكترو حراج</h1>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <input 
              type="text" 
              placeholder="ابحث عن حساب سوني، يد تحكم، أو بلايستيشن..."
              className="w-full bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 transition-all outline-none font-bold text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <ICONS.Search />
            </div>
          </div>

          <button className="p-3 bg-gray-100 rounded-2xl text-gray-600 hover:bg-gray-200 transition-colors">
            <ICONS.User />
          </button>
        </div>
      </nav>

      {/* Categories Horizontal Scroll */}
      <div className="bg-white border-b overflow-x-auto custom-scrollbar whitespace-nowrap px-4 py-4 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex gap-3">
          <button 
            onClick={() => setSelectedCategory('الكل')}
            className={`px-7 py-3 rounded-2xl font-black text-sm transition-all ${selectedCategory === 'الكل' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            الكل
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => !comingSoonCategories.includes(cat) && setSelectedCategory(cat)}
              className={`px-7 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-xl scale-105' 
                  : comingSoonCategories.includes(cat)
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
              {comingSoonCategories.includes(cat) && (
                <span className="text-[9px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-lg border border-amber-200">قريباً</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <span className="w-2.5 h-10 bg-blue-600 rounded-full shadow-sm"></span>
            {selectedCategory === 'الكل' ? 'المعروض حالياً' : `قسم ${selectedCategory}`}
          </h2>
          <span className="text-gray-400 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">{filteredListings.length} إعلان</span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map(item => (
              <ListingCard key={item.id} listing={item} onClick={setSelectedListing} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[4rem] py-40 text-center border-4 border-dashed border-gray-100 shadow-inner">
            <div className="text-gray-200 mb-6 flex justify-center">
              <svg className="w-28 h-28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-800">لا توجد إعلانات بعد</h3>
            <p className="text-gray-400 font-bold mt-3 text-lg">كن أول من يضع بصمته في هذا القسم!</p>
          </div>
        )}
      </main>

      {/* Action Center - The Sony Floating Button */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
        <div className="relative">
          {/* Floating PS5 Icon */}
          <div className="absolute -right-16 -top-20 w-28 h-28 animate-float pointer-events-none md:block hidden">
            <img src="https://m.media-amazon.com/images/I/51051HiS9OL._SL1143_.jpg" className="w-full h-full object-contain drop-shadow-2xl" alt="PS5" />
          </div>
          {/* Floating Controller Icon */}
          <div className="absolute -left-16 -top-12 w-24 h-24 animate-float-slow -rotate-12 pointer-events-none md:block hidden">
            <img src="https://m.media-amazon.com/images/I/6127p8S0s+L._SL1500_.jpg" className="w-full h-full object-contain drop-shadow-2xl" alt="DS" />
          </div>

          <button 
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white font-black py-7 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(37,99,235,0.6)] hover:bg-blue-700 hover:-translate-y-2 transition-all active:scale-95 flex items-center justify-center gap-4 border-4 border-white"
          >
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
              <ICONS.Plus />
            </div>
            <span className="text-2xl">أضف إعلانك</span>
          </button>
        </div>
      </div>

      {showForm && <ListingForm onClose={() => setShowForm(false)} onSubmit={handleAddListing} />}

      {/* Listing Viewer Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col lg:flex-row animate-in zoom-in duration-300">
            <button onClick={() => setSelectedListing(null)} className="absolute top-8 left-8 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full z-20 transition-all shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="lg:w-3/5 bg-gray-100 flex items-center justify-center h-[350px] lg:h-auto overflow-hidden group">
              <img src={selectedListing.imageUrl} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700" alt={selectedListing.title} />
            </div>

            <div className="lg:w-2/5 p-10 lg:p-14 overflow-y-auto custom-scrollbar bg-white">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">
                  {selectedListing.category}
                </span>
                <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">•</span>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <ICONS.Location /> {selectedListing.location}
                </span>
              </div>
              
              <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{selectedListing.title}</h2>
              
              <div className="text-5xl font-black text-blue-600 mb-10 flex items-baseline gap-3">
                {selectedListing.price === 0 ? 'على السوم' : (
                  <>
                    <span>{selectedListing.price.toLocaleString()}</span>
                    <span className="text-xl font-bold">ريال</span>
                  </>
                )}
              </div>

              <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 mb-10">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">وصف المنتج</h4>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed font-medium text-lg">
                  {selectedListing.description}
                </div>
              </div>

              <div className="flex gap-4 sticky bottom-0 bg-white pt-4">
                <button className="flex-1 bg-[#25D366] text-white font-black py-6 rounded-3xl shadow-xl shadow-green-100 hover:scale-105 transition-all flex items-center justify-center gap-3 text-xl">
                  واتساب
                </button>
                <button className="flex-1 bg-gray-900 text-white font-black py-6 rounded-3xl hover:bg-black transition-all text-xl">
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
