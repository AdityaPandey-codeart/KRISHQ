import { motion } from 'framer-motion';
import { Apple, Globe2, Leaf, Play, Send } from 'lucide-react';

const footerSections = [
  {
    title: 'Shop',
    links: ['Plants', 'Seeds', 'Fertilizers', 'Pots', 'Garden Tools']
  },
  {
    title: 'Services',
    links: ['Polyhouse', 'Landscaping', 'Lawn Development', 'Terrace Farming', 'Plantation Projects']
  },
  {
    title: 'Company',
    links: ['About Us', 'Contact', 'Careers', 'Blog']
  },
  {
    title: 'Support',
    links: ['FAQs', 'Shipping', 'Return Policy', 'Privacy Policy', 'Terms & Conditions']
  },
  {
    title: 'Business',
    links: ['Bulk Orders', 'Corporate Orders', 'Become a Vendor', 'Franchise']
  }
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="border-t border-stone-200 bg-stone-50/80"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-2 text-lg font-black tracking-tight text-emerald-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Leaf size={18} />
              </span>
              <span>KRISHQ</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Premium plants, gardening essentials, and trusted agri services for homes, farms, and modern green spaces.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#/contact" className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Contact us
              </a>
              <a href="#/services" className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white">
                Explore services
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700">
                <Play size={16} />
                Download App
              </a>
             
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">{section.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="transition hover:text-emerald-700">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Copyright © 2026 KRISHQ. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700">
              <Globe2 size={16} />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700">
              <Send size={16} />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700">
              <Apple size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
