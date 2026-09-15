import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';

export default function SplashPage({ onContinue }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f7fcf5_0%,#f2f7ee_100%)] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl rounded-[28px] border border-emerald-100 bg-white p-5 sm:p-7 lg:p-8 shadow-[0_20px_60px_-24px_rgba(6,78,59,0.25)]"
      >
        <div className="flex items-center gap-2 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
          <Sparkles size={14} />
          Trusted agri-commerce
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-900">
          Grow smarter with <span className="text-emerald-600">KRISHQ</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-slate-600">
          Discover quality plants, farm essentials, and field services in one calm experience built for modern growers.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Explore now
            <ArrowRight size={16} />
          </button>
          <div className="text-sm text-slate-500">
            Verified plants • Secure checkout • Fast support
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-stone-200 bg-stone-50/70 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <Leaf size={18} />
            <span className="text-sm font-semibold">Reliable support for farms, gardens, and everyday growth</span>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            From cultivation assistance to doorstep delivery, every interaction is designed to feel authentic, dependable, and premium.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
