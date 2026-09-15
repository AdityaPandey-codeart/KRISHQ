import { ArrowRight } from 'lucide-react';

export default function FloatingCartBar({ cart, toggleCart }) {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div 
            id="floating-cart-bar"
            className={`fixed bottom-4 left-4 right-4 bg-green-700 md:hidden text-white rounded-2xl shadow-xl p-4 flex items-center justify-between z-40 transition-all duration-300 transform ${
                totalItems > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
            }`}
        >
            <div className="flex items-center">
                <button
                    onClick={() => (window.location.href = '/')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white mr-3"
                    aria-label="Go home"
                >
                    <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex flex-col">
                    <span className="text-xs opacity-80 font-medium">Added Items</span>
                    <span className="font-bold text-sm">{totalItems} Items | ₹{totalAmount}</span>
                </div>
            </div>
            <button 
                onClick={toggleCart} 
                className="bg-white text-green-700 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-sm active:scale-95"
            >
                View Cart <i className="fa-solid fa-bag-shopping ml-1"></i>
            </button>
        </div>
    );
}
