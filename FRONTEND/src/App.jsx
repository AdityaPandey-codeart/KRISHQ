import { useState, useEffect } from 'react';

import { useAuth } from './context/Authcontext';
import { products } from './data/products';
import { supabase } from './lib/supabase';

import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import FloatingCartBar from './components/FloatingCartBar';
import ProfileModal from './components/CustomerProfile';

import PaymentPage from './pages/PaymentPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import Footer from './components/Footer';

export default function App() {
    // ============================
    // CART
    // ============================

    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('plantCart')) || [];
        } catch {
            return [];
        }
    });

    // ============================
    // AUTH
    // ============================

    const { session, loading } = useAuth();

    const [authStage, setAuthStage] = useState('splash');

    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    // ============================
    // APP STATE
    // ============================

    const [currentCategory, setCurrentCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(null);
    const [currentHash, setCurrentHash] = useState(
        window.location.hash || '#/'
    );
    const [lastOrder, setLastOrder] = useState(null);

    // ============================
    // SUPABASE SESSION
    // ============================

    useEffect(() => {
        if (loading) return;

        if (session?.user) {
            const user = session.user;

            setUserProfile((prev) => ({
                ...prev,
                name:
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email?.split('@')[0] ||
                    '',
                email: user.email || '',
                avatar:
                    user.user_metadata?.avatar_url ||
                    prev.avatar,
            }));

            setAuthStage('home');
        } else {
            setUserProfile({
                name: '',
                email: '',
                avatar:
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            });

            setAuthStage('splash');
        }
    }, [session, loading]);

    // ============================
    // SAVE CART
    // ============================

    useEffect(() => {
        localStorage.setItem('plantCart', JSON.stringify(cart));
    }, [cart]);

    // ============================
    // HASH CHANGE
    // ============================

    useEffect(() => {
        const onHash = () => {
            setCurrentHash(window.location.hash || '#/');
        };

        window.addEventListener('hashchange', onHash);

        return () => {
            window.removeEventListener('hashchange', onHash);
        };
    }, []);

    // ============================
    // ADD TO CART
    // ============================

    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find(
                (item) => item.id === product.id
            );

            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              qty: item.qty + 1,
                          }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    qty: 1,
                },
            ];
        });
    };

    // ============================
    // UPDATE CART QUANTITY
    // ============================

    const handleUpdateQty = (id, change) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === id) {
                        const nextQty = item.qty + change;

                        return nextQty <= 0
                            ? null
                            : {
                                  ...item,
                                  qty: nextQty,
                              };
                    }

                    return item;
                })
                .filter(Boolean)
        );
    };

    // ============================
    // CHECKOUT
    // ============================

    const handleCheckout = () => {
        if (cart.length === 0) return;

        setIsCartOpen(false);

        const orderTotal = cart.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        );

        const pending = {
            items: [...cart],
            totalAmount: orderTotal,
        };

        setPendingOrder(pending);
        window.location.hash = '#/payment';
    };

    // ============================
    // COMPLETE PAYMENT
    // ============================

    const completePayment = (method) => {
        if (!pendingOrder) return;

        const generatedOrderID =
            'ORD-' + Math.floor(100000 + Math.random() * 900000);

        const newOrderPayload = {
            id: generatedOrderID,
            date: new Date().toISOString(),
            items: pendingOrder.items,
            totalAmount: pendingOrder.totalAmount,
            paymentMethod: method,
        };

        const existingOrders = JSON.parse(
            localStorage.getItem('plantOrders') || '[]'
        );

        existingOrders.push(newOrderPayload);

        localStorage.setItem(
            'plantOrders',
            JSON.stringify(existingOrders)
        );

        setLastOrder(newOrderPayload);

        window.location.hash = '#/success';

        setTimeout(() => {
            setCart([]);
            setPendingOrder(null);
        }, 1500);
    };

    // ============================
    // SEARCH
    // ============================

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (
            window.location.hash !== '#/' &&
            window.location.hash !== ''
        ) {
            window.location.hash = '#/';
        }
    };

    // ============================
    // CATEGORY
    // ============================

    const handleCategoryChange = (catId) => {
        setCurrentCategory(catId);

        if (
            window.location.hash !== '#/' &&
            window.location.hash !== ''
        ) {
            window.location.hash = '#/';
        }
    };

    // ============================
    // LOGIN SUCCESS
    // ============================

    const handleLogin = (user) => {
        if (!user) return;

        setUserProfile((prev) => ({
            ...prev,
            name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                '',
            email: user.email || '',
            avatar:
                user.user_metadata?.avatar_url ||
                prev.avatar,
        }));

        setAuthStage('home');
    };

    // ============================
    // REGISTER SUCCESS
    // ============================

    const handleRegister = (user) => {
        if (!user) return;

        setUserProfile((prev) => ({
            ...prev,
            name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                '',
            email: user.email || '',
            avatar:
                user.user_metadata?.avatar_url ||
                prev.avatar,
        }));

        setAuthStage('home');
    };

    // ============================
    // LOGOUT
    // ============================

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout Error:', error);
                return;
            }

            setUserProfile({
                name: '',
                email: '',
                avatar:
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            });

            setIsProfileOpen(false);
            setAuthStage('splash');
            window.location.hash = '#/';
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    // ============================
    // PRODUCT DETAIL
    // ============================

    const isProductDetail = currentHash.startsWith('#/product/');

    const productId = isProductDetail
        ? parseInt(currentHash.split('/').pop(), 10)
        : null;

    const currentProduct = productId
        ? products.find((p) => p.id === productId)
        : null;

    // ============================
    // FILTER PRODUCTS
    // ============================

    const filteredProducts = products.filter((p) => {
        const matchesCategory =
            currentCategory === 'all' ||
            p.category === currentCategory;

        const search = searchQuery.toLowerCase();

        const matchesSearch =
            p.name.toLowerCase().includes(search) ||
            (p.hindi || '').toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    // ============================
    // CART COUNT
    // ============================

    const totalCartItemsCount = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    // ============================
    // AUTH LOADING
    // ============================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />

                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Loading KRISHQ...
                    </p>
                </div>
            </div>
        );
    }

    // ============================
    // AUTH FLOW
    // ============================

    if (!session && authStage === 'splash') {
        return (
            <SplashPage
                onContinue={() => setAuthStage('onboarding')}
            />
        );
    }

    if (!session && authStage === 'onboarding') {
        return (
            <OnboardingPage
                onFinish={() => setAuthStage('login')}
            />
        );
    }

    if (!session && authStage === 'login') {
        return (
            <LoginPage
                onLogin={handleLogin}
                onGoToRegister={() => setAuthStage('register')}
            />
        );
    }

    if (!session && authStage === 'register') {
        return (
            <RegisterPage
                onRegister={handleRegister}
                onGoToLogin={() => setAuthStage('login')}
            />
        );
    }

    // ============================
    // MAIN APPLICATION
    // ============================

    return (
        <div className="min-h-screen bg-gray-50/50 antialiased font-sans pb-24 lg:pb-0">
            <Navbar
                cartCount={totalCartItemsCount}
                avatar={userProfile.avatar}
                onSearch={handleSearch}
                currentCategory={currentCategory}
                onCategoryChange={handleCategoryChange}
                currentHash={currentHash}
                toggleCart={() => setIsCartOpen(!isCartOpen)}
                toggleProfile={() => setIsProfileOpen(!isProfileOpen)}
            />

            <main className="max-w-7xl mx-auto px-4 py-6">
                {currentHash === '#/payment' ? (
                    <PaymentPage
                        order={pendingOrder}
                        onComplete={completePayment}
                    />
                ) : currentHash === '#/services' ? (
                    <ServicesPage />
                ) : currentHash === '#/contact' ? (
                    <ContactSection />
                ) : currentHash === '#/about' ? (
                    <AboutPage />
                ) : currentHash === '#/success' && lastOrder ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" />

                        <div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
                            <h3 className="mb-2 text-xl font-black">
                                Order Placed Successfully
                            </h3>

                            <p className="mb-4 text-sm text-gray-500">
                                Order ID: {lastOrder.id}
                            </p>

                            <p className="mb-6 text-sm text-gray-600">
                                We received your payment via{' '}
                                <span className="font-semibold">
                                    {lastOrder.paymentMethod}
                                </span>
                                .
                            </p>

                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => {
                                        window.location.hash = '#/';
                                        setLastOrder(null);
                                    }}
                                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                                >
                                    Back to Home
                                </button>

                                <button
                                    onClick={() => {
                                        window.location.hash =
                                            '#/profile';
                                        setLastOrder(null);
                                    }}
                                    className="rounded-lg bg-gray-100 px-4 py-2"
                                >
                                    View Orders
                                </button>
                            </div>
                        </div>
                    </div>
                ) : isProductDetail && currentProduct ? (
                    <ProductDetailPage
                        key={currentProduct.id}
                        product={currentProduct}
                        cart={cart}
                        onAdd={handleAddToCart}
                        onUpdateQty={handleUpdateQty}
                        onBack={() => {
                            window.location.hash = '#/';
                        }}
                    />
                ) : (
                    <ProductGrid
                        products={filteredProducts}
                        cart={cart}
                        onAdd={handleAddToCart}
                        onUpdateQty={handleUpdateQty}
                    />
                )}
            </main>

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onUpdateQty={handleUpdateQty}
                onCheckout={handleCheckout}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onLogout={handleLogout}
                user={session?.user}
            />

            <FloatingCartBar
                cart={cart}
                toggleCart={() => setIsCartOpen(!isCartOpen)}
            />

            <Footer />

            {typeof window !== 'undefined' &&
                (window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1') && (
                    <button
                        onClick={() => {
                            const sample = cart.length
                                ? {
                                      items: cart,
                                      totalAmount: cart.reduce(
                                          (sum, item) =>
                                              sum +
                                              item.price * item.qty,
                                          0
                                      ),
                                  }
                                : {
                                      items: [
                                          {
                                              id: 9999,
                                              name: 'Test Plant',
                                              price: 10,
                                              qty: 1,
                                              img: '',
                                          },
                                      ],
                                      totalAmount: 10,
                                  };

                            setPendingOrder(sample);
                            window.location.hash = '#/payment';
                        }}
                        className="fixed bottom-4 right-4 z-50 hidden rounded-lg bg-blue-600 px-3 py-2 text-white shadow-lg md:block"
                    >
                        Test Payment
                    </button>
                )}
        </div>
    );
}

// ============================
// CONTACT SECTION
// ============================

function ContactSection() {
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.append(
            'access_key',
            '617df559-99c3-449b-85e4-79739d1e4982'
        );

        try {
            const response = await fetch(
                'https://api.web3forms.com/submit',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                event.target.reset();

                window.alert(
                    'Thanks! Your enquiry has been submitted successfully.'
                );
            } else {
                window.alert(
                    data.message ||
                        'Something went wrong. Please try again.'
                );
            }
        } catch (error) {
            window.alert(
                error.message || 'Failed to send enquiry.'
            );
        }
    };

    return (
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Contact us
                </p>

                <h2 className="mt-3 text-3xl font-black text-slate-900">
                    We’re here for plant orders, services, and bulk
                    enquiries.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                    Share your requirements and our team will get back
                    to you with the right support for farming, gardening,
                    and delivery needs.
                </p>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                        Phone: +91 9917322769
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                        Email: support@krishq.example
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
                        Address: KRISHQ Nursery, Green Market Road, India
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Your name
                            </label>

                            <input
                                name="name"
                                required
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Your email
                            </label>

                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Subject
                        </label>

                        <input
                            name="subject"
                            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                            placeholder="What would you like to discuss?"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Your message
                        </label>

                        <textarea
                            name="message"
                            required
                            rows={6}
                            className="min-h-32 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                            placeholder="Tell us about your requirement"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        Send enquiry
                    </button>
                </form>
            </div>
        </section>
    );
}