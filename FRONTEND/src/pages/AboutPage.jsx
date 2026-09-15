import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * AboutUs.jsx — Sangati Bio Plantech Pvt. Ltd.
 * Stack: React + Tailwind + Framer Motion
 *
 * Design notes:
 * - Palette is earth + leaf toned (not generic cream/terracotta):
 *   forest ink #16301F, fern green #4F7942, sage #9CB88F, soil #8C5A3C, ivory #FAF7F0
 * - Display face: Fraunces (organic, grown feel) / Body: Inter
 * - Signature element: a "growth vine" — a vertical line that fills in as you
 *   scroll, with leaf-node markers at each section. Mirrors the brand's
 *   actual idea (growing greener spaces) instead of a decorative animation.
 * - Animations are minimal: fade+rise on scroll reveal, gentle hover lift.
 *   No heavy parallax / no per-letter effects — keeps it production-clean.
 */

// ---------- Data (from Sangati Bio Plantech "About Us") ----------

const AUDIENCE = [
  "Farmers & Agri-Entrepreneurs",
  "Home Gardeners",
  "Landscape Professionals",
  "Residential & Commercial Owners",
  "Government & Institutional Projects",
  "Educational Campuses",
  "Hotels & Hospitality",
  "Real Estate Developers",
  "Corporate Offices",
  "Plant Nurseries",
  "Environmental & Community Orgs",
];

const PRODUCTS = [
  "Fruit, Ornamental, Timber & Medicinal Plants",
  "Indoor & Outdoor Plants",
  "Seasonal Flower Plants",
  "Seeds & Organic Inputs",
  "Fertilizers & Plant Nutrition",
  "Plant Protection Solutions",
  "Pots & Decorative Planters",
  "Gardening Tools & Equipment",
  "Irrigation Products",
  "Landscaping Materials",
  "Farming Accessories",
];

const SERVICES = [
  "Polyhouse Design & Installation",
  "Landscaping & Garden Development",
  "Lawn Development",
  "Terrace Farming Solutions",
  "Plantation Planning & Execution",
  "Bulk Plantation Projects",
  "Farm Consultation",
  "Multiple & Mixed Cropping Planning",
  "Irrigation Planning",
  "Green Space Maintenance",
  "Corporate Green Solutions",
];

const WHY_US = [
  "Premium Quality Products",
  "Expert Agricultural Guidance",
  "End-to-End Green Solutions",
  "Reliable & Timely Delivery",
  "Transparent Pricing",
  "Customer-First Support",
  "Sustainable Practices",
  "Professional Project Execution",
  "Secure Shopping Experience",
  "Continuous Innovation",
];

const VALUES = [
  {
    title: "Trust",
    text: "Lasting relationships are built through honesty, transparency, and consistency.",
  },
  {
    title: "Quality",
    text: "Uncompromising standards across every product, service, and customer experience.",
  },
  {
    title: "Sustainability",
    text: "Environmentally responsible solutions that create long-term value for people and the planet.",
  },
  {
    title: "Innovation",
    text: "We embrace technology and continuous improvement to deliver smarter green solutions.",
  },
  {
    title: "Customer Success",
    text: "Your growth is our greatest achievement — every decision starts with your needs.",
  },
];

// ---------- Small building blocks ----------

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function Reveal({ children, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="inline-block text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-[#4F7942] mb-3">
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <Reveal className="max-w-2xl">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#16301F] leading-[1.1]">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-[#3F4F42] text-base sm:text-lg leading-relaxed">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

function Chip({ children }) {
  return (
    <motion.span
      variants={fadeUp}
      className="inline-flex items-center rounded-full border border-[#9CB88F] bg-white/60 px-4 py-2 text-sm text-[#16301F] hover:bg-[#4F7942] hover:text-white hover:border-[#4F7942] transition-colors duration-300"
    >
      {children}
    </motion.span>
  );
}

function ListCard({ items }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerParent}
      className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={fadeUp}
          className="group flex items-start gap-3 rounded-xl sm:rounded-2xl bg-white border border-[#E7E2D3] px-4 py-3 hover:border-[#4F7942] hover:shadow-[0_6px_20px_-8px_rgba(22,48,31,0.25)] transition-all duration-300"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C5A3C] group-hover:bg-[#4F7942] transition-colors" />
          <span className="text-sm sm:text-[15px] text-[#233527] leading-snug">
            {item}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** The signature "growth vine" — a vertical stem that fills in as the page
 * scrolls, marking each section like nodes on a growing plant. */
function GrowthVine({ targetRef }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pointer-events-none absolute left-4 sm:left-8 top-0 bottom-0 w-px hidden md:block">
      <div className="absolute inset-0 bg-[#E7E2D3]" />
      <motion.div
        style={{ height }}
        className="absolute top-0 left-0 w-px bg-gradient-to-b from-[#4F7942] to-[#16301F]"
      />
      <motion.div
        style={{ top: height }}
        className="absolute -left-[5px] h-[11px] w-[11px] rounded-full bg-[#4F7942] shadow-[0_0_0_4px_rgba(79,121,66,0.15)]"
      />
    </div>
  );
}

// ---------- Main component ----------

export default function AboutUs() {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative bg-[#FAF7F0] text-[#16301F] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        body, .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <GrowthVine targetRef={pageRef} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative px-5 sm:px-10 md:px-16 pt-16 pb-14 sm:pt-32 sm:pb-28">
        <div className="max-w-5xl mx-auto md:pl-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>Sangati Bio Plantech Pvt. Ltd.</Eyebrow>
            <h1 className="font-serif text-[2.15rem] leading-[1.15] sm:text-6xl sm:leading-[1.05] md:text-7xl text-[#16301F]">
              Growing greener{" "}
              <span className="text-[#4F7942]">spaces.</span>{" "}
              <span className="italic font-normal">Empowering</span>{" "}
              sustainable living.
            </h1>
            <p className="mt-5 sm:mt-6 max-w-xl text-[15px] sm:text-lg text-[#3F4F42] leading-relaxed">
              We combine premium agricultural products, expert services, and
              modern technology into one trusted platform — for anyone
              building a thriving green space, from a single balcony plant
              to a large plantation project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- PURPOSE ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <SectionHeading
            eyebrow="Our Purpose"
            title="Agriculture, made accessible."
            sub="By bringing together high-quality products, professional services, and a seamless digital experience, we help people grow with confidence — no matter the size of the project."
          />
        </div>
      </section>

      {/* ---------------- WHO WE SERVE ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <SectionHeading eyebrow="Who We Serve" title="One platform, every kind of grower." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerParent}
            className="mt-8 flex flex-wrap gap-3"
          >
            {AUDIENCE.map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- PRODUCTS ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <SectionHeading
            eyebrow="Products"
            title="Products that grow with you"
            sub="A curated collection selected for healthy growth, dependable performance, and long-term value."
          />
          <div className="mt-8">
            <ListCard items={PRODUCTS} />
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <SectionHeading
            eyebrow="Services"
            title="Complete green solutions"
            sub="From consultation to completion, every project is executed with precision and attention to detail."
          />
          <div className="mt-8">
            <ListCard items={SERVICES} />
          </div>
        </div>
      </section>

      {/* ---------------- DELIVERY ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <Reveal>
            <div className="rounded-2xl sm:rounded-3xl bg-[#16301F] text-[#FAF7F0] px-5 sm:px-10 py-8 sm:py-14">
              <Eyebrow>
                <span className="text-[#9CB88F]">Delivery</span>
              </Eyebrow>
              <h3 className="font-serif text-2xl sm:text-3xl leading-snug">
                Smart delivery, built around your needs.
              </h3>
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <p className="text-sm sm:text-base text-[#D8E3D2] leading-relaxed">
                  Everyday gardening and agricultural essentials arrive
                  quickly, across every supported city.
                </p>
                <p className="text-sm sm:text-base text-[#D8E3D2] leading-relaxed">
                  Commercial plantations, institutional projects, and bulk
                  orders run on scheduled logistics — planned so every
                  project lands on time.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <SectionHeading eyebrow="Why Sangati" title="Built on trust, not just transactions." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerParent}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          >
            {WHY_US.map((w) => (
              <motion.div
                key={w}
                variants={fadeUp}
                className="rounded-2xl border border-[#E7E2D3] bg-white px-4 py-5 text-sm sm:text-[15px] text-[#233527] hover:border-[#4F7942] hover:-translate-y-0.5 transition-all duration-300"
              >
                {w}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- MISSION / VISION ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10 grid md:grid-cols-2 gap-4 sm:gap-6">
          <Reveal className="rounded-2xl sm:rounded-3xl bg-white border border-[#E7E2D3] p-6 sm:p-10">
            <Eyebrow>Our Mission</Eyebrow>
            <p className="font-serif text-xl sm:text-2xl leading-snug text-[#16301F]">
              To simplify agriculture and green living through premium
              products, expert services, and dependable logistics — all on
              one trusted platform.
            </p>
          </Reveal>
          <Reveal className="rounded-2xl sm:rounded-3xl bg-[#4F7942] text-white p-6 sm:p-10">
            <Eyebrow>
              <span className="text-[#E4EEDD]">Our Vision</span>
            </Eyebrow>
            <p className="font-serif text-xl sm:text-2xl leading-snug">
              To become India's most trusted platform for agriculture,
              gardening, landscaping, and sustainable green solutions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CORE VALUES ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto md:pl-10">
          <SectionHeading eyebrow="Core Values" title="What guides every decision." />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerParent}
            className="mt-8 divide-y divide-[#E7E2D3] border-t border-b border-[#E7E2D3]"
          >
            {VALUES.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-5"
              >
                <h4 className="font-serif text-lg sm:text-xl w-full sm:w-40 shrink-0 text-[#16301F] group-hover:text-[#4F7942] transition-colors">
                  {v.title}
                </h4>
                <p className="text-sm sm:text-base text-[#3F4F42] leading-relaxed">
                  {v.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- PROMISE / CTA ---------------- */}
      <section className="px-5 sm:px-10 md:px-16 py-16 sm:py-28">
        <div className="max-w-5xl mx-auto md:pl-10 text-center md:text-left">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight text-[#16301F] max-w-2xl">
              Together, let's grow a{" "}
              <span className="text-[#4F7942] italic">greener future.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[#3F4F42] text-base sm:text-lg leading-relaxed mx-auto md:mx-0">
              Every plant we nurture and every project we deliver reflects
              our commitment to excellence — dependable products,
              professional expertise, and service you can rely on.
            </p>
            <button className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#16301F] text-white px-7 py-3.5 text-sm sm:text-base font-medium hover:bg-[#4F7942] transition-colors duration-300">
              Explore AgriKart
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
