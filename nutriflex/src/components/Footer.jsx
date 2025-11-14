export default function Footer() {
  return (
    <footer className="mt-12">
      {/* Barra de newsletter (fidelidade ao mock) */}
      <div className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center gap-3">
          <p className="text-sm sm:flex-1">Cadastre seu email e receba promoções e novidades exclusivas</p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input className="flex-1 rounded-sm bg-white text-neutral-900 px-3 py-2 text-sm" placeholder="Seu email" />
            <button className="rounded-sm bg-brand-red px-4 py-2 text-white text-sm">Cadastrar</button>
          </div>
        </div>
      </div>
      {/* Faixa inferior vermelha */}
      <div className="bg-brand-red text-black">
        <div className="mx-auto max-w-6xl px-4 py-6 grid sm:grid-cols-3 gap-6 text-xs">
          <div>
            <img src="/images/logo-arturia.svg" alt="Arturia Suplementos" className="h-10" />
            <p className="mt-2">Rua Exemplo, 123 • Cidade/UF</p>
            <p>CNPJ 00.000.000/0000-00</p>
          </div>
          <div>
            <p>Formas de pagamento</p>
            <p>Selos de segurança</p>
          </div>
          <div>
            <p>Desenvolvido por Arturia • Loja virtual</p>
          </div>
        </div>
      </div>
    </footer>
  );
}