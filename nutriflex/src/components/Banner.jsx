import { motion as Motion } from "framer-motion";

export default function Banner() {
  return (
    <Motion.section
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 sm:p-10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-4xl font-bold">
          Performance de alto nível com <span className="text-white">Arturia Suplementos</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-100">
          Promoções de lançamento: até <span className="text-black font-semibold">30% OFF</span> em whey, creatina e pré-treinos.
        </p>
        <div className="mt-4 flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-md bg-white text-brand-red px-4 py-2 hover:bg-white/90">
            Ver ofertas
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 text-black hover:opacity-90">
            Lançamentos
          </button>
        </div>
      </div>
      <Motion.div
        className="absolute -right-12 -bottom-12 hidden sm:block"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="h-40 w-40 rounded-full bg-white/10 border border-white/20" />
      </Motion.div>
    </Motion.section>
  );
}