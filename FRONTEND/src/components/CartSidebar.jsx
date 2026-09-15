import { X } from 'lucide-react';

export default function CartSidebar({ isOpen, onClose, cart, onUpdateQty, onCheckout }) {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <>
            {/* Backdrop Dark Mask Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar View Shell */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header Context */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    
                        <h2 className="font-black text-lg text-gray-800 flex items-center gap-2">
                            <i className="fa-solid fa-cart-shopping text-green-600"></i> My Cart Basket
                        </h2>
                    <button onClick={onClose} className="p-2  text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Items Queue Dynamic Listing */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-28 text-sm">
                            <div className="text-4xl mb-2">🌱</div>
                            Aapka cart bilkul khali hai.
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div 
                                key={item.id} 
                                className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-2xs"
                                style={{ animation: `cardSlideUp 0.3s ease-out ${idx * 0.02}s both` }}
                            >
                                <img src={item.img} className="w-12 h-12 rounded-lg object-cover shrink-0" alt="" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 text-xs truncate">{item.name}</h4>
                                    <p className="text-green-600 font-bold text-xs mt-0.5">₹{item.price}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 shrink-0">
                                    <button onClick={() => onUpdateQty(item.id, -1)} className="text-gray-500 hover:text-red-500 font-bold px-1 text-xs cursor-pointer">-</button>
                                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                    <button onClick={() => onUpdateQty(item.id, 1)} className="text-gray-500 hover:text-green-600 font-bold px-1 text-xs cursor-pointer">+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total Calculations and Final CTA Footer */}
                {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-semibold text-gray-500">To Pay Amount:</span>
                            <span className="text-2xl font-black text-gray-900">₹{totalAmount}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl shadow-lg transition-all text-center tracking-wide uppercase text-sm cursor-pointer active:scale-98"
                        >
                            Proceed To Checkout <i className="fa-solid fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
