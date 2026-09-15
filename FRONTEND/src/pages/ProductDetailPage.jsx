import { useState } from 'react';
import { ArrowLeft, Calendar, Leaf, ShieldAlert, Star, CheckCircle, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function ProductDetailPage({ product, cart, onAdd, onUpdateQty, onBack }) {
    const [activeImage, setActiveImage] = useState(product.images ? product.images[0] : product.img);
    const [activeTab, setActiveTab] = useState('sowing'); // sowing, fruiting, pests
    const [reviews, setReviews] = useState(product.reviews || []);
    
    // Review form states
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const cartItem = cart.find(item => item.id === product.id);
    const cartQty = cartItem ? cartItem.qty : 0;

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewerName.trim() || !comment.trim()) return;

        const newReview = {
            name: reviewerName,
            rating: parseInt(rating),
            date: new Date().toISOString().split('T')[0],
            comment: comment,
            verified: true // Simulated purchase verification
        };

        setReviews([newReview, ...reviews]);
        setIsSubmitted(true);
        setReviewerName('');
        setComment('');
        setRating(5);

        // Reset submit confirmation after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    return (
        <div className="max-w-6xl mx-auto py-4 animate-[fadeIn_0.3s_ease-out]">
            {/* Top Navigation Back Action */}
            <button 
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold transition-colors cursor-pointer group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Catalog</span>
            </button>

            {/* Main Product Showcase Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xs mb-8">
                
                {/* Left Side: Image Gallery */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 aspect-square flex items-center justify-center shadow-xs">
                        <img 
                            src={activeImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-black text-green-700 shadow-sm backdrop-blur-xs flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                            15 MINS DELIVERY
                        </div>
                    </div>
                    
                    {/* Gallery Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2.5 overflow-x-auto py-1 justify-center">
                            {product.images.map((imgUrl, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(imgUrl)}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                        activeImage === imgUrl ? 'border-green-600 scale-95 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Primary Info & Actions */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                        {/* Category and Title */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                {product.category}
                            </span>
                            <span className="text-gray-400 text-xs">ID: #{product.id}</span>
                        </div>
                        
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-1">
                            {product.name}
                        </h1>
                        <p className="text-lg text-green-600 font-semibold mb-4">{product.hindi}</p>

                        {/* Ratings Quick View */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg text-sm font-bold">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                {averageRating}
                            </div>
                            <span className="text-gray-400 text-sm">|</span>
                            <span className="text-gray-500 text-sm cursor-pointer hover:underline">
                                {reviews.length} Customer Reviews
                            </span>
                        </div>

                        {/* Description */}
                        <div className="border-t border-b border-gray-100 py-5 mb-6">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">Description</h3>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                {product.description || `High-quality ${product.name} sapling. Ideal for planting in home gardens, terraces, or farm fields. Sourced organically and delivered fresh in 15 minutes.`}
                            </p>
                        </div>
                    </div>

                    <div>
                        {/* Price & Cart Add Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                            <div>
                                <span className="text-xs text-gray-400 block font-medium">BEST PRICE</span>
                                <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
                            </div>

                            <div className="w-full sm:w-auto">
                                {cartQty === 0 ? (
                                    <button 
                                        onClick={() => onAdd(product)}
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer uppercase tracking-wider"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-between gap-6 bg-green-600 text-white font-extrabold rounded-xl px-5 py-3 shadow-md">
                                        <button 
                                            onClick={() => onUpdateQty(product.id, -1)}
                                            className="text-lg hover:text-green-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 cursor-pointer active:scale-75"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-base font-black w-8 text-center">{cartQty}</span>
                                        <button 
                                            onClick={() => onUpdateQty(product.id, 1)}
                                            className="text-lg hover:text-green-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-700 cursor-pointer active:scale-75"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery promise highlight */}
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-medium">
                            <span className="text-green-600 font-bold">✓ Freshness Guaranteed</span>
                            <span>•</span>
                            <span>Secure Transit</span>
                            <span>•</span>
                            <span>Instant Replacement</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: care guide tabs and detailed reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Plant Care Guide Tabs */}
                <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
                    <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" /> Plant Care Guide (पौधा देखभाल मार्गदर्शिका)
                    </h2>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-100 mb-6 gap-2 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => setActiveTab('sowing')}
                            className={`pb-3 px-2 font-bold text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                                activeTab === 'sowing' 
                                ? 'border-green-600 text-green-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Sowing Season (कब लगाएं?)
                        </button>
                        <button
                            onClick={() => setActiveTab('fruiting')}
                            className={`pb-3 px-2 font-bold text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                                activeTab === 'fruiting' 
                                ? 'border-green-600 text-green-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Fruiting & Yield (फल कब आएगा?)
                        </button>
                        <button
                            onClick={() => setActiveTab('pests')}
                            className={`pb-3 px-2 font-bold text-sm border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                                activeTab === 'pests' 
                                ? 'border-green-600 text-green-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Pests & Insects (कीड़ों से सुरक्षा)
                        </button>
                    </div>

                    {/* Tab Content Display */}
                    <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 min-h-[160px] flex flex-col justify-between">
                        {activeTab === 'sowing' && (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-extrabold text-gray-800">Sowing/Planting Season Details</h4>
                                </div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    {product.sowingSeason || "Best planted in spring (February-March) or during early monsoon (July-August) for premium growth. Needs fertile, loamy soil with proper water drainage."}
                                </p>
                            </div>
                        )}

                        {activeTab === 'fruiting' && (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-green-100 text-green-700 p-1.5 rounded-lg">
                                        <Leaf className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-extrabold text-gray-800">Fruiting / Flowering Timeline</h4>
                                </div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    {product.fruitingTime || "Flowers usually appear within the first 6-12 months. Grafted or premium hybrids yield edible fruit/blooms within 1-2 years under proper care."}
                                </p>
                            </div>
                        )}

                        {activeTab === 'pests' && (
                            <div className="animate-[fadeIn_0.2s_ease-out]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-red-50 text-red-700 p-1.5 rounded-lg">
                                        <ShieldAlert className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-extrabold text-gray-800">Insect & Pest Protection Guide</h4>
                                </div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    {product.pestControl || "Apply organic neem oil solution (5ml/L of water) every 15-20 days to protect foliage. Avoid overwatering to prevent root rot and collar diseases."}
                                </p>
                            </div>
                        )}
                        
                        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span>💡 Expert Advice: Regular pruning increases plant life and fruit yield.</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Customer Reviews and Add Form */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Reviews Summary Card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
                        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" /> Customer Reviews
                        </h2>

                        {/* Write a review form */}
                        <form onSubmit={handleReviewSubmit} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6">
                            <h4 className="font-bold text-sm text-gray-800 mb-3">Write a Customer Review</h4>
                            
                            {isSubmitted && (
                                <div className="mb-3 text-xs bg-green-50 text-green-700 p-2 rounded-lg font-bold flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Review added successfully!
                                </div>
                            )}

                            <div className="space-y-2.5">
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Your Name (अपना नाम)"
                                        value={reviewerName}
                                        onChange={(e) => setReviewerName(e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Rating:</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((starVal) => (
                                            <button
                                                type="button"
                                                key={starVal}
                                                onClick={() => setRating(starVal)}
                                                className="cursor-pointer focus:outline-none"
                                            >
                                                <Star className={`w-4 h-4 ${starVal <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <textarea 
                                        placeholder="Write details of your experience with the plant... (समीक्षा लिखें)"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-green-500 min-h-[60px]"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-xs cursor-pointer active:scale-98 transition-all"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>

                        {/* Reviews list */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            {reviews.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to write one!</p>
                            ) : (
                                reviews.map((rev, index) => (
                                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-extrabold text-sm text-gray-900">{rev.name}</span>
                                            <span className="text-[10px] text-gray-400">{rev.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`w-3 h-3 ${i < rev.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                                                    />
                                                ))}
                                            </div>
                                            {rev.verified && (
                                                <span className="bg-green-50 text-green-700 text-[9px] px-1 rounded-md font-extrabold flex items-center gap-0.5">
                                                    <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-xs leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
