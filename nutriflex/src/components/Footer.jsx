export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center gap-3">
          <p className="text-sm sm:flex-1 uppercase">Cadastre seu e-mail e receba promoções e novidades exclusivas</p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input className="flex-1 rounded-sm bg-white text-neutral-900 px-3 py-2 text-sm" placeholder="Digite seu e-mail" />
            <button className="rounded-sm bg-white px-4 py-2 text-black text-sm">Enviar</button>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap items-center gap-6 justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://logodownload.org/wp-content/uploads/2017/12/site-blindado-logo-4.png"
                alt="Site Blindado"
                className="h-8 w-auto object-contain"
                loading="lazy"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" fill="#16a34a" />
                <path d="M12 8c-2.5 0-4.5 2-4.5 4.5S9.5 17 12 17s4.5-2 4.5-4.5S14.5 8 12 8z" fill="#fff" />
                <path d="M12 9.5c-.9 0-1.7.5-2.1 1.2.7.2 1.4.7 2.1 1.6.7-.9 1.4-1.4 2.1-1.6-.4-.7-1.2-1.2-2.1-1.2z" fill="#16a34a" />
              </svg>
              <span className="text-xs">Site Sustentável</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/imgSite/SELO-GARANTIA.png"
                alt="Selo Garantia"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">Nota média da loja</div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-semibold">4.8</span>
                <div className="flex">
                  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/></svg>
                  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/></svg>
                  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/></svg>
                  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/></svg>
                  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2">
            <div className="font-semibold">Central de atendimento</div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
              <span>Seg a Sex das 9h às 12h | 13h30 às 18h</span>
            </div>
      <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137 .703-2.877z"/>
                </svg>
              <span>(11) 3003-3993</span>
            </div>
            <div className="flex items-center gap-2"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M22 4l-10 7L2 4"/></svg><span>sac@arturiasuplementos.com.br</span></div>
          </div>
          <div className="space-y-3">
            <div className="font-semibold">Formas de pagamento</div>
            <div className="flex flex-wrap items-center gap-2">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Visa%202021.svg"
                alt="Visa"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Mastercard%202019%20logo.svg"
                alt="Mastercard"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/American%20Express%20logo%20(2018).svg"
                alt="American Express"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Elo%20card%20association%20logo%20-%20black%20text.svg"
                alt="Elo"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Logo%E2%80%94pix%20powered%20by%20Banco%20Central%20(Brazil%2C%202020).svg"
                alt="Pix"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <span className="inline-flex items-center justify-center h-6 px-2 rounded border border-neutral-300 bg-white">
                <svg viewBox="0 0 72 24" className="h-4 w-auto" aria-hidden="true">
                  <rect x="2" y="3" width="68" height="18" rx="2" fill="#fff" stroke="#999" />
                  <rect x="6" y="5" width="1" height="14" fill="#111" />
                  <rect x="9" y="5" width="2" height="14" fill="#111" />
                  <rect x="13" y="5" width="1" height="14" fill="#111" />
                  <rect x="16" y="5" width="3" height="14" fill="#111" />
                  <rect x="21" y="5" width="1" height="14" fill="#111" />
                  <rect x="24" y="5" width="2" height="14" fill="#111" />
                  <rect x="28" y="5" width="1" height="14" fill="#111" />
                  <rect x="31" y="5" width="2" height="14" fill="#111" />
                  <rect x="35" y="5" width="1" height="14" fill="#111" />
                  <rect x="38" y="5" width="3" height="14" fill="#111" />
                  <rect x="43" y="5" width="1" height="14" fill="#111" />
                  <rect x="46" y="5" width="2" height="14" fill="#111" />
                  <rect x="50" y="5" width="1" height="14" fill="#111" />
                  <rect x="53" y="5" width="3" height="14" fill="#111" />
                  <rect x="58" y="5" width="1" height="14" fill="#111" />
                  <rect x="61" y="5" width="2" height="14" fill="#111" />
                </svg>
                <span className="sr-only">Boleto</span>
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="font-semibold">Loja verificada</div>
            <div className="flex flex-wrap items-center gap-2">
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Google%202015%20logo.svg"
                alt="Google"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Reclame-aqui-logo.png"
                alt="Reclame Aqui"
                className="h-6 w-auto object-contain"
                loading="lazy"
              />
              <span className="inline-flex items-center justify-center h-6 px-2 rounded border border-neutral-300 bg-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" fill="#0ea5e9" />
                  <path d="M9 12l2 2 4-4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="ml-1 text-[11px]">Compra Segura</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}