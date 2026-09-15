import { useState } from 'react';

export default function ProductCard({ product, cartItem, onAdd, onUpdateQty, index }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAddClick = (e) => {
        e.preventDefault(); // Navigation block karega jab ADD par click ho
        setIsAnimating(true);
        setTimeout(() => {
            onAdd(product);
            setIsAnimating(false);
        }, 120);
    };

    return (
        <div 
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
            style={{ animation: `cardSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) ${Math.min(index * 0.03, 0.4)}s both` }}
        >
            {/* Clickable Image & Title Area to view Details */}
            <a href={`#/product/${product.id}`} className="block group flex-1">
                <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-gray-50">
                    <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-green-700 shadow-xs backdrop-blur-xs">
                        <i className="fa-solid fa-bolt mr-1 text-yellow-500 animate-pulse"></i> 15 MINS
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight line-clamp-1 group-hover:text-green-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{product.hindi}</p>
                </div>
            </a>

            {/* Price & Add Engine Footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                <span className="font-extrabold text-base text-gray-900">₹{product.price}</span>
                
                <div className="transition-transform duration-100">
                    {!cartItem ? (
                        <button 
                            onClick={handleAddClick} 
                            className={`bg-white hover:bg-green-50 border border-green-600 text-green-600 font-bold px-6 py-1.5 rounded-lg shadow-sm text-sm transition-all uppercase tracking-wider cursor-pointer active:scale-95 ${isAnimating ? 'scale-90' : ''}`}
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 bg-green-600 text-white font-bold rounded-lg px-3 py-1.5 shadow-sm text-sm animate-statePop" onClick={(e) => e.preventDefault()}>
                            <button 
                                onClick={() => onUpdateQty(product.id, -1)} 
                                className="hover:text-green-200 transition-colors px-1 cursor-pointer transform active:scale-75"
                            >
                                -
                            </button>
                            <span className="w-4 text-center">{cartItem.qty}</span>
                            <button 
                                onClick={() => onUpdateQty(product.id, 1)} 
                                className="hover:text-green-200 transition-colors px-1 cursor-pointer transform active:scale-75"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
