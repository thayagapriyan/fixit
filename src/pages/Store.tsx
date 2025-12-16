import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { TOOLS_DATA } from '../constants/originalConstants';
import { Product } from '../types';

const Store: React.FC = () => {
  const addToCart = (product: Product) => {
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tools Marketplace</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          High-quality equipment for professionals and DIY enthusiasts.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS_DATA.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full"
          >
            <div className="relative h-48 bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm text-gray-700">
                ⭐ {product.rating}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                {product.category}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <ShoppingCart size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
