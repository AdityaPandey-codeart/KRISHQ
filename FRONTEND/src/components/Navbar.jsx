import { Home, Info, Phone, Search, ShoppingCart, UserRound, Leaf, PackageSearch } from 'lucide-react';

export default function Navbar({ cartCount, onSearch, currentCategory, onCategoryChange, currentHash, toggleCart, toggleProfile, avatar }) {
    const categories = [
        { id: 'all', label: 'All Plants' },
        { id: 'fruits', label: 'Fruits' },
        { id: 'timber', label: 'Timber' },
        { id: 'decorative', label: 'Decorative & Flowers' }
    ];

    const navLinks = [
        { href: '#/', label: 'Home' },
        { href: '#/services', label: 'Our Services' },
        { href: '#/contact', label: 'Contact Us' },
        { href: '#/about', label: 'About Us' }
    ];

    const mobileTabs = [
        { href: '#/', label: 'Home', icon: Home },
        { href: '#/services', label: 'Services', icon: PackageSearch },
        { href: '#/contact', label: 'Contact', icon: Phone },
        { href: '#/about', label: 'About', icon: Info }
    ];

    const isActiveLink = (href) => href === '#/' ? currentHash === '#/' || currentHash === '' : currentHash === href;

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col px-3 py-2.5 sm:px-4 lg:px-6 lg:py-3">
                    <div className="flex items-center justify-between gap-2 lg:gap-4">
                        <button onClick={toggleProfile} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 shadow-sm lg:hidden" aria-label="Open profile">
                            {avatar ? (
                                <img src={avatar} alt="profile" className="h-9 w-9 rounded-full object-cover" />
                            ) : (
                                <UserRound size={18} />
                            )}
                        </button>

                        <a href="Home" className="flex items-center gap-2 text-lg font-black tracking-tight text-emerald-700 sm:text-xl">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <Leaf size={18} />
                            </span>
                            <span>KRISHQ</span>
                        </a>

                        <button onClick={toggleCart} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 shadow-sm lg:hidden" aria-label="Open cart">
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 lg:mt-3">
                        <label className="relative flex-1">
                            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search plants and essentials"
                                className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-4 text-sm text-stone-700 outline-none transition focus:border-emerald-500 focus:bg-white"
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </label>

                        <div className="hidden items-center gap-2 lg:flex">
                            {/* <button onClick={toggleProfile} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm" aria-label="Open profile">
                                {avatar ? (
                                    <img src={avatar} alt="profile" className="h-9 w-9 rounded-full object-cover" />
                                ) : (
                                    <UserRound size={18} />
                                )}
                            </button> */}
                            <button onClick={toggleCart} className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                                <ShoppingCart size={18} />
                                Cart
                                {cartCount > 0 && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{cartCount}</span>}
                            </button>
                        </div>
                    </div>

                    <nav className="mt-3 hidden items-center gap-1 lg:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                                    isActiveLink(link.href) ? 'bg-emerald-50 text-emerald-700' : 'text-stone-600 hover:bg-stone-100 hover:text-emerald-700'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-stone-100 bg-stone-50/70">
                    <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2 sm:px-4 lg:px-6">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition lg:text-sm ${
                                    currentCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-stone-100'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden">
                <div className="mx-auto flex max-w-5xl items-center justify-around px-2 py-2">
                    {mobileTabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActiveLink(tab.href);
                        return (
                            <a key={tab.href} href={tab.href} className={`flex flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold ${active ? 'text-emerald-700' : 'text-stone-500'}`}>
                                <Icon size={18} />
                                <span className="mt-1">{tab.label}</span>
                            </a>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
