
import React from 'react';
import { Listing } from '../types';
import { ICONS } from '../constants';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div 
      onClick={() => onClick(listing)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 flex flex-col group active:scale-[0.98]"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={listing.imageUrl} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg font-black uppercase">
          {listing.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-base mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{listing.title}</h3>
        
        <div className="flex items-center text-gray-400 text-[11px] mb-4 gap-3">
          <span className="flex items-center gap-1 font-medium">
            <ICONS.Location />
            {listing.location}
          </span>
          <span className="font-medium">{listing.createdAt}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="text-lg font-black text-blue-700">
            {listing.price === 0 ? 'على السوم' : `${listing.price.toLocaleString()} ريال`}
          </div>
          <div className="text-gray-300 group-hover:text-blue-200 transition-colors">
            <ICONS.User />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
