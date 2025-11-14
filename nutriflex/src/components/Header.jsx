// Removido toggle de tema: vamos manter tema único com alto contraste
import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../assets/data/products";

export default function Header({ query, setQuery, onOpenCart }) {
  const promos = [
  "BLACK Friday",
  "descontos de até 80%off",
  "BLACK Friday",
  "descontos de até 80%off",
  "BLACK Friday",
  "descontos de até 80%off",
  "BLACK Friday",
    
  ];
  
  const [menuOpen, setMenuOpen] = useState(false);
  const lines = [
    categories.slice(0, Math.ceil(categories.length / 3)),
    categories.slice(Math.ceil(categories.length / 3), Math.ceil((categories.length / 3) * 2)),
    categories.slice(Math.ceil((categories.length / 3) * 2)),
  ];
  return (
    <header className="sticky top-0 z-40 text-white">
      {/* Faixa superior escura com logo, busca e ações */}
      <div className="bg-neutral-900">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center ">
          <Link to="/" className="flex items-center gap-2">
            <img src="/imgSite/logo.png" alt="Arturia Suplementos" className="h-16 sm:h-20 w-auto gap-1 margin-right-2" /> 
          </Link>
          <span className="  bg-brand-red px-2 py-1 rounded-md text-sm font-bold">Arturia<a className="text-red-700">Suplementos</a></span>

         

          {/* Ações à direita (fixo no canto superior direito) */}
          <div className="hidden sm:flex items-center gap-3 text-xs fixed top-2 right-4 z-50">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-neutral-800"
              aria-label="Abrir menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
            <a href="#" className="hover:underline text-neutral-300">Rastreio</a>
            <a href="#" className="hover:underline text-neutral-300">Minha conta</a>
            <button
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-neutral-800"
              aria-label="Abrir carrinho"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="7" cy="21" r="1" />
                <circle cx="17" cy="21" r="1" />
              </svg>
            </button>
          </div>
          {/* Botão hambúrguer para mobile */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden fixed top-2 right-4 z-50 inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-neutral-800"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Faixa de navegação (fidelidade ao mock: fundo vermelho, texto branco) */}
      <nav className="bg-brand-red">
        <div className="mx-auto max-w-6xl px-0">
          <div className="marquee text-[11px] sm:text-xs uppercase tracking-wide bg-white text-black">
            <div className="marquee-track">
              {promos.map((c, i) => (
                <span key={`p1-${i}`} className="whitespace-nowrap">{c}</span>
              ))}
              {promos.map((c, i) => (
                <span key={`p2-${i}`} className="whitespace-nowrap">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Painel oculto com 3 linhas de categorias */}
      {menuOpen && (
        <div className="fixed top-12 right-4 z-50 w-72 sm:w-80 rounded-sm bg-[white]/40 shadow-xl/900 overflow-hidden">
          <div className="px-3 py-2 text-xs uppercase tracking-wide text-neutral-300 flex items-center justify-center text-black relative">
            <span className="text-black font-bold">Menu</span>
            <button
              className="absolute right-2 rounded p-1 hover:bg-neutral-200"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>
          <div className="mr-3 p-3 space-y-2 rounded-md  " >
            {/* Atalhos: Minha conta, Rastreio, Sobre a loja, Contato */}
            <div className="grid grid-cols-1 gap-1">
              <a href="#" className="no-underline w-full inline-flex items-center justify-center px-2 py-1 text-[11px] uppercase rounded bg-white hover:bg-neutral-100 text-black" onClick={() => setMenuOpen(false)}>Minha conta</a>
              <a href="#" className="no-underline w-full inline-flex items-center justify-center px-2 py-1 text-[11px] uppercase rounded bg-white hover:bg-neutral-100 text-black" onClick={() => setMenuOpen(false)}>Rastreio</a>
              <a href="#" className="no-underline w-full inline-flex items-center justify-center px-2 py-1 text-[11px] uppercase rounded bg-white hover:bg-neutral-100 text-black" onClick={() => setMenuOpen(false)}>Sobre a loja</a>
              <a href="#" className="no-underline w-full inline-flex items-center justify-center px-2 py-1 text-[11px] uppercase rounded bg-white hover:bg-neutral-100 text-black" onClick={() => setMenuOpen(false)}>Contato</a>
            </div>
            
          </div>
        </div>
      )}
    </header>
  );
}