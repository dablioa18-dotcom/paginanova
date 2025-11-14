export default function HeroImageSection() {
  const bg = "/imgSite/jonathan-borba-H6wTktsFxik-unsplash.jpg";
  return (
    <section
      className="relative rounded-xl overflow-hidden shadow-soft"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay para fidelidade de cor (vermelho/escuro do mock) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7a0a0e]/80 via-[#1a1a1a]/70 to-[#2a2a2a]/60" />

      <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-20 text-white">
        <h2 className="text-2xl sm:text-4xl font-bold drop-shadow">Força, foco e desempenho</h2>
        <p className="mt-2 max-w-xl text-sm sm:text-base opacity-95">
          Suplementos selecionados para potencializar seus treinos. Confira lançamentos e promoções.
        </p>
        <div className="mt-6 flex gap-3">
          <h3 href="#produtos" className="rounded-md bg-brand-red px-4 py-2 text-white text-sm">Ver produtos</h3>
          <h3 href="#promocoes" className="rounded-md bg-white/20 px-4 py-2 text-white text-sm ;">Promoções</h3>
        </div>
      </div>
    </section>
  );
}