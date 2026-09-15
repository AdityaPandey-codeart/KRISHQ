import { motion } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    Flower2,
    Leaf,
    PackageCheck,
    Sprout,
    Trees,
    Tractor,
    Warehouse,
    Wheat
} from 'lucide-react';

const services = [
    {
        title: 'Agricultural Equipment Delivery',
        description: 'Agricultural tools, machinery, irrigation products, fertilizers, pesticides, seeds, and farming essentials delivered within minutes.',
        icon: Tractor,
        gradient: 'from-emerald-500 to-lime-500'
    },
    {
        title: 'Plant Delivery Service',
        description: 'Horticulture, timber, flowering, decorative, indoor, outdoor, fruit, and medicinal plants delivered fresh and safely.',
        icon: Sprout,
        gradient: 'from-green-500 to-teal-500'
    },
    {
        title: 'Bulk Plantation Projects',
        description: 'Large-scale plantation solutions for farmers, institutions, industries, and government projects with farm planning.',
        icon: Trees,
        gradient: 'from-lime-500 to-emerald-600'
    },
    {
        title: 'Farm Development Services',
        description: 'Complete farm setup, land planning, plantation design, irrigation planning, and crop establishment support.',
        icon: Wheat,
        gradient: 'from-amber-500 to-green-500'
    },
    {
        title: 'Garden & Landscape Development',
        description: 'Home gardens, commercial gardens, public parks, resort landscaping, lawn development, and green spaces.',
        icon: Flower2,
        gradient: 'from-rose-500 to-emerald-500'
    },
    {
        title: 'Lawn & Grass Solutions',
        description: 'Natural grass installation, sports ground grass, garden lawns, and professional maintenance services.',
        icon: Leaf,
        gradient: 'from-lime-400 to-green-600'
    },
    {
        title: 'Terrace Garden Solutions',
        description: 'Terrace gardening setup, rooftop green spaces, and urban farming systems for modern homes and offices.',
        icon: Building2,
        gradient: 'from-sky-500 to-green-500'
    },
    {
        title: 'Polyhouse & Greenhouse Construction',
        description: 'Design and construction of polyhouses, greenhouses, shade net houses, and climate-controlled cultivation structures.',
        icon: Warehouse,
        gradient: 'from-cyan-500 to-emerald-500'
    },
    {
        title: 'Nursery & Plantation Consultancy',
        description: 'Expert guidance for plant selection, plantation management, nursery planning, and agricultural consultation.',
        icon: PackageCheck,
        gradient: 'from-green-600 to-slate-600'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 26 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' }
    }
};

export default function OurServices() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-emerald-100/80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#ecfdf5_45%,#f8fafc_100%)] px-4 py-10 shadow-sm dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_34%),linear-gradient(135deg,#07130f_0%,#0f241c_48%,#101827_100%)] sm:px-6 lg:px-8">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-400/10" />

            <div className="relative mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 shadow-sm backdrop-blur-xl dark:border-emerald-400/20 dark:bg-white/10 dark:text-emerald-200">
                        Agricultural Quick Commerce
                    </span>
                    <h1 className="mt-5 text-3xl font-black text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
                        Our Services
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
                        Premium farm delivery, plantation, development, and green infrastructure solutions built for farmers, homes, institutions, and modern agricultural businesses.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((service) => {
                        const Icon = service.icon;

                        return (
                            <motion.article
                                key={service.title}
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.01 }}
                                className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/72 p-5 shadow-sm backdrop-blur-2xl transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/8"
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${service.gradient}`} />
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-transform duration-300 group-hover:scale-125 dark:bg-emerald-400/10" />

                                <div className={`mb-5 flex h-13 w-13 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg shadow-emerald-900/15`}>
                                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                                </div>

                                <h2 className="text-lg font-black leading-snug text-slate-950 dark:text-white">
                                    {service.title}
                                </h2>
                                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {service.description}
                                </p>

                                <button className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-600 hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 dark:hover:bg-emerald-500 dark:hover:text-white">
                                    Learn More
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
