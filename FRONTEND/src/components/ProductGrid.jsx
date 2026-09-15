import ProductCard from './ProductCard';

export default function ProductGrid({ products, cart, onAdd, onUpdateQty }) {
    if (products.length === 0) {
        return (
            <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="text-4xl mb-2">🔍</div>
                <p className="font-medium text-gray-700">Koi plant nahi mila!</p>
                <p className="text-xs text-gray-400 mt-1">Doosra keyword ya filter try karein.</p>
            </div>
        );
    }

    return (
        <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((product, index) => {
                const cartItem = cart.find(item => item.id === product.id);
                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        cartItem={cartItem}
                        onAdd={onAdd}
                        onUpdateQty={onUpdateQty}
                        index={index}
                    />
                );
            })}
        </div>
    );
}
