import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingBag, Sprout } from 'lucide-react';

const slides = [
  {
    icon: Sprout,
    title: 'Discover plants and agri essentials',
    description: 'Browse healthy plants, tools, and agricultural supplies tailored for farms, gardens, and green spaces.'
  },
  {
    icon: ShoppingBag,
    title: 'Order faster like your daily essentials app',
    description: 'Add products to your cart, place orders quickly, and get the right support for your field or backyard.'
  },
  {
    icon: CheckCircle2,
    title: 'Book field services whenever you need them',
    description: 'From planting help to farm care services, stay connected to trusted support that keeps your growth on track.'
  }
];

export default function OnboardingPage({ onFinish }) {
  const [step, setStep] = useState(0);
  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step === slides.length - 1) {
      onFinish();
      return;
    }

    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f5fff7_0%,#eefbf3_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white p-5 sm:p-7 shadow-[0_20px_60px_-24px_rgba(6,78,59,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Onboarding</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">Your smart agri-commerce guide</h1>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {step + 1}/{slides.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="mt-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon size={22} />
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900">{currentSlide.title}</h2>
            <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">{currentSlide.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-2">
          {slides.map((slide, index) => (
            <div key={slide.title} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {step === slides.length - 1 ? 'Continue to login' : 'Next'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
