import { useState } from 'react';
import { 
    CreditCard, Smartphone, Truck, Wallet, ArrowLeft, 
    User, Phone, MapPin, ShieldCheck, KeyRound
} from 'lucide-react';

export default function PaymentPage({ order, onComplete }) {
    const methods = [
        { id: 'upi', label: 'UPI', desc: 'Pay using BHIM/PhonePe/GPay', icon: Smartphone },
        { id: 'card', label: 'Debit / Credit Card', desc: 'Pay with Visa / Mastercard / Rupay', icon: CreditCard },
        { id: 'blinkit', label: 'Blinkit Pay (Wallet)', desc: 'Fast checkout linked wallet', icon: Truck },
        { id: 'zepto', label: 'Zepto Pay (Wallet)', desc: 'Instant payments & wallet', icon: Wallet },
        { id: 'amazon', label: 'Amazon Pay', desc: 'Quick Amazon Wallet / UPI', icon: CreditCard },
        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when the order arrives', icon: Wallet }
    ];

    // Page states
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [step, setStep] = useState('selection'); // selection, details, otp
    
    // Form value states
    const [upiId, setUpiId] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    
    const [cardNo, setCardNo] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const [shippingName, setShippingName] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');

    // Error states
    const [errors, setErrors] = useState({});

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-gray-500">No order to pay for.</div>
        </div>
    );

    const handleSelectMethod = (method) => {
        setSelectedMethod(method);
        setStep('details');
        setErrors({});
    };

    const handleBack = () => {
        if (step === 'otp') {
            setStep('details');
        } else {
            setStep('selection');
            setSelectedMethod(null);
        }
        setErrors({});
    };

    // Formatters
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length > 0) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    // Validations
    const validateDetails = () => {
        const newErrors = {};

        if (selectedMethod.id === 'upi') {
            if (!upiId.trim() || !upiId.includes('@')) {
                newErrors.upiId = 'Please enter a valid UPI ID (e.g. name@upi)';
            }
        } 
        
        else if (selectedMethod.id === 'card') {
            if (cardNo.replace(/\s/g, '').length !== 16) {
                newErrors.cardNo = 'Card number must be 16 digits';
            }
            if (!cardName.trim()) {
                newErrors.cardName = 'Cardholder name is required';
            }
            if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                newErrors.cardExpiry = 'Expiry must be MM/YY';
            } else {
                const [m] = cardExpiry.split('/').map(Number);
                if (m < 1 || m > 12) newErrors.cardExpiry = 'Invalid month';
            }
            if (cardCvv.length !== 3) {
                newErrors.cardCvv = 'CVV must be 3 digits';
            }
        } 
        
        else if (['blinkit', 'zepto', 'amazon'].includes(selectedMethod.id)) {
            if (phone.length !== 10) {
                newErrors.phone = 'Mobile number must be 10 digits';
            }
        } 
        
        else if (selectedMethod.id === 'cod') {
            if (!shippingName.trim()) {
                newErrors.shippingName = 'Full Name is required';
            }
            if (shippingPhone.length !== 10) {
                newErrors.shippingPhone = 'Valid 10-digit phone number is required';
            }
            if (!shippingAddress.trim() || shippingAddress.length < 10) {
                newErrors.shippingAddress = 'Please enter a complete delivery address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProceed = (e) => {
        e.preventDefault();
        if (!validateDetails()) return;

        // If wallet, proceed to simulated OTP verification
        if (['blinkit', 'zepto', 'amazon'].includes(selectedMethod.id)) {
            setStep('otp');
        } else {
            // Complete payment instantly for other payment types
            onComplete(selectedMethod.label);
        }
    };

    const handleOtpVerify = (e) => {
        e.preventDefault();
        if (otp.length !== 4) {
            setErrors({ otp: 'Please enter a valid 4-digit OTP' });
            return;
        }
        // Complete payment successfully
        onComplete(selectedMethod.label);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-16">
            <header className="bg-white border-b border-gray-100 py-4 shadow-xs sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {selectedMethod && (
                            <button onClick={handleBack} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </button>
                        )}
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                            KRISHQ Secure Checkout
                        </h1>
                    </div>
                    <div className="bg-green-50 text-green-700 font-extrabold px-3 py-1.5 rounded-xl text-xs md:text-sm flex items-center gap-1 border border-green-100">
                        <ShieldCheck className="w-4 h-4" /> Secure Payment
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Right Side: Order Summary Panel */}
                <section className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:order-2">
                    <h2 className="font-black text-gray-800 mb-4 text-base uppercase tracking-wider">Order Summary</h2>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                <img src={item.img} alt="" className="w-12 h-12 object-cover rounded-xl border bg-gray-50" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-800 truncate">{item.name}</div>
                                    <div className="text-xs text-gray-500 font-semibold mt-0.5">Qty: {item.qty}</div>
                                </div>
                                <div className="text-sm font-extrabold text-gray-900">₹{item.price * item.qty}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                            <span>Bag Value</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                            <span>Delivery Partner Fee</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-dashed border-gray-200">
                            <span className="text-sm font-bold text-gray-800">Total to Pay</span>
                            <span className="text-2xl font-black text-gray-900">₹{order.totalAmount}</span>
                        </div>
                    </div>
                </section>

                {/* Left Side: Interactive Forms Panel */}
                <section className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs lg:order-1 min-h-[350px]">
                    
                    {/* Step 1: Choose Payment Method */}
                    {step === 'selection' && (
                        <div>
                            <h2 className="text-lg font-black text-gray-800 mb-5">Choose a Payment Method</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {methods.map(m => {
                                    const Icon = m.icon;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => handleSelectMethod(m)}
                                            className="flex items-center gap-4 p-4 border border-gray-100 hover:border-green-600 rounded-xl hover:shadow-xs text-left cursor-pointer transition-all duration-200 group active:scale-98"
                                        >
                                            <div className="bg-green-50 text-green-700 rounded-xl p-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-extrabold text-gray-800 group-hover:text-green-700 transition-colors text-sm md:text-base">{m.label}</div>
                                                <div className="text-xs text-gray-500 font-medium truncate mt-0.5">{m.desc}</div>
                                            </div>
                                            <div className="text-xs font-black text-green-600 group-hover:translate-x-0.5 transition-transform">PAY &gt;</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Form Details Input */}
                    {step === 'details' && selectedMethod && (
                        <form onSubmit={handleProceed} className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                <div>
                                    <h2 className="text-lg font-black text-gray-800">Enter Payment Details</h2>
                                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Payment Method: {selectedMethod.label}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="text-xs font-bold text-green-600 hover:underline cursor-pointer"
                                >
                                    Change Method
                                </button>
                            </div>

                            {/* Dynamic sub-forms based on payment selection */}
                            
                            {/* UPI Sub-form */}
                            {selectedMethod.id === 'upi' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">UPI ID</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                                <Smartphone className="w-5 h-5" />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="enter UPI ID (e.g. name@bank)"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all ${
                                                    errors.upiId ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                        </div>
                                        {errors.upiId && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.upiId}</p>}
                                    </div>

                                    {/* Quick Selection Handles */}
                                    <div>
                                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Popular Handles</span>
                                        <div className="flex flex-wrap gap-2">
                                            {['@okaxis', '@paytm', '@okicici', '@ybl', '@oksbi'].map((handle) => (
                                                <button
                                                    type="button"
                                                    key={handle}
                                                    onClick={() => {
                                                        const base = upiId.split('@')[0];
                                                        setUpiId((base || 'username') + handle);
                                                    }}
                                                    className="px-3 py-1.5 bg-gray-100 hover:bg-green-50 hover:text-green-700 rounded-lg text-xs font-bold text-gray-600 cursor-pointer transition-colors"
                                                >
                                                    {handle}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Credit/Debit Card Sub-form with Live Credit Card Graphic */}
                            {selectedMethod.id === 'card' && (
                                <div className="space-y-6">
                                    {/* Live dynamic visual credit card */}
                                    <div className="relative w-full max-w-[340px] h-[190px] mx-auto bg-gradient-to-tr from-emerald-600 to-teal-800 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200/90 block">Debit / Credit Card</span>
                                                <span className="text-base font-black tracking-wider mt-0.5 block">Van-Dhan Pay</span>
                                            </div>
                                            <div className="w-10 h-8 bg-amber-400/80 rounded-md shadow-xs opacity-90 flex items-center justify-center font-bold text-xs text-amber-900 border border-amber-300">CHIP</div>
                                        </div>

                                        <div className="text-lg font-black tracking-widest text-center my-4 font-mono">
                                            {cardNo || '•••• •••• •••• ••••'}
                                        </div>

                                        <div className="flex justify-between text-xs tracking-wider uppercase font-semibold">
                                            <div>
                                                <span className="text-[8px] text-emerald-200 block">CARD HOLDER</span>
                                                <span className="truncate max-w-[170px] block font-mono">{cardName || 'YOUR NAME'}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[8px] text-emerald-200 block">EXPIRES</span>
                                                <span className="block font-mono">{cardExpiry || 'MM/YY'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card input fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength="19"
                                                value={cardNo}
                                                onChange={(e) => setCardNo(formatCardNumber(e.target.value))}
                                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all ${
                                                    errors.cardNo ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                            {errors.cardNo && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.cardNo}</p>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                                            <input
                                                type="text"
                                                placeholder="Name as printed on card"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all ${
                                                    errors.cardName ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                            {errors.cardName && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.cardName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm text-center transition-all ${
                                                    errors.cardExpiry ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                            {errors.cardExpiry && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.cardExpiry}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                                            <input
                                                type="password"
                                                placeholder="•••"
                                                maxLength="3"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm text-center transition-all ${
                                                    errors.cardCvv ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                            {errors.cardCvv && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.cardCvv}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Wallet Sub-form */}
                            {['blinkit', 'zepto', 'amazon'].includes(selectedMethod.id) && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold text-sm">
                                                +91
                                            </span>
                                            <input
                                                type="text"
                                                maxLength="10"
                                                placeholder="Enter 10-digit number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all ${
                                                    errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.phone}</p>}
                                        <p className="text-[10px] text-gray-400 font-medium mt-1">We will send a 4-digit verification code to this mobile number to confirm transaction.</p>
                                    </div>
                                </div>
                            )}

                            {/* Cash on Delivery (COD) Sub-form */}
                            {selectedMethod.id === 'cod' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Name</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                                    <User className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Customer full name"
                                                    value={shippingName}
                                                    onChange={(e) => setShippingName(e.target.value)}
                                                    className={`w-full pl-9 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all ${
                                                        errors.shippingName ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                    }`}
                                                />
                                            </div>
                                            {errors.shippingName && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.shippingName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Mobile Number</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                                    <Phone className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="text"
                                                    maxLength="10"
                                                    placeholder="10-digit number"
                                                    value={shippingPhone}
                                                    onChange={(e) => setShippingPhone(e.target.value.replace(/\D/g, ''))}
                                                    className={`w-full pl-9 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all ${
                                                        errors.shippingPhone ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                    }`}
                                                />
                                            </div>
                                            {errors.shippingPhone && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.shippingPhone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Complete Delivery Address</label>
                                        <div className="relative">
                                            <span className="absolute top-3 left-3 text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                            </span>
                                            <textarea
                                                placeholder="Flat/House No., Street Name, Landmark, City, State, PIN"
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-sm transition-all min-h-[90px] ${
                                                    errors.shippingAddress ? 'border-red-500' : 'border-gray-200 focus:border-green-600'
                                                }`}
                                            />
                                        </div>
                                        {errors.shippingAddress && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors.shippingAddress}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Final Proceed Button */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-98 text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                <span>Proceed to Pay ₹{order.totalAmount}</span>
                            </button>
                        </form>
                    )}

                    {/* Step 3: Wallet OTP Verification */}
                    {step === 'otp' && selectedMethod && (
                        <form onSubmit={handleOtpVerify} className="space-y-6 animate-[fadeIn_0.3s_ease-out] max-w-sm mx-auto py-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <KeyRound className="w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-black text-gray-900">OTP Verification</h2>
                                <p className="text-xs text-gray-400 font-semibold mt-1">
                                    We sent a 4-digit code to +91 ******{phone.slice(-4)}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Enter 4-Digit OTP</label>
                                    <input
                                        type="text"
                                        maxLength="4"
                                        placeholder="••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white text-base text-center tracking-[1em] font-black transition-all ${
                                            errors.otp ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-600'
                                        }`}
                                    />
                                    {errors.otp && <p className="text-xs text-red-500 font-semibold mt-1.5 text-center">{errors.otp}</p>}
                                    <p className="text-[10px] text-gray-400 font-bold text-center mt-2">Simulated: Type <span className="text-green-600">1234</span> or any 4 digits to pass.</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-98 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <span>Verify & Complete Payment</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full text-center text-xs font-bold text-gray-500 hover:text-green-600 hover:underline cursor-pointer"
                                >
                                    Back to Details
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}
