export default function HeroImageSection() {
  const bg = "/imgSite/academiabg.jpg";
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
          Suplementos para potencializar seus treinos. Confira lançamentos e promoções.
        </p>
        <p className=" uppercase mt-2 max-w-xl text-10 sm:text-base opacity-95">
          Melhore seus resultados com suplementos de alta qualidade.
          <br />
          black friday o ano todo!
        </p>
      </div>
    </section>
  );
}