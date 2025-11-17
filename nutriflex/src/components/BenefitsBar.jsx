export default function BenefitsBar() {
  const items = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h11v10H3zM14 9h4l3 3v5h-7V9zM5 19a2 2 0 11-.001-3.999A2 2 0 015 19zm12 0a2 2 0 11-.001-3.999A2 2 0 0117 19z" />
        </svg>
      ),
      text: "Frete grátis em todo território brasileiro",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6l7 4-7 4-7-4 7-4zm0 8l7 4-7 4-7-4 7-4z" />
        </svg>
      ),
      text: "Reembolso garantido em até 30 dias",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" strokeWidth="2" />
          <path d="M3 10h18" strokeWidth="2" />
        </svg>
      ),
      text: "até 4x sem juros",
    },
    {
      icon: (
        <img src="/imgSite/pix.png" alt="" srcSet="" className="h-5 w-5" />
      ),
      text: "desconto de até 80% no pix",
    },
  ];

  return (
    <section aria-label="Vantagens" className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.text}
            className="rounded-lg bg-neutral-900 text-white px-5 py-3 shadow-sm ring-1 ring-neutral-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-brand-red">{item.icon}</span>
              <span className="text-xs sm:text-sm tracking-wide uppercase">
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}