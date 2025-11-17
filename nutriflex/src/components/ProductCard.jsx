import { motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function ProductCard({ product, onQuickBuy }) {
  const navigate = useNavigate();
  const formatBRL = (val) =>
    typeof val === "number"
      ? val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : val;
  return (
    <Motion.div
      className="group rounded-xl border border-neutral-200 bg-white p-3 shadow-soft transition-shadow ring-1 ring-transparent hover:ring-brand-red/20 cursor-pointer"
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
               
      <div className="relative bg-white overflow-hidden pr-[15px] pl-[10px]" >
        
        <img
          src={product.images?.[0] ?? product.image}
          alt={product.name}
          className="block w-full object-contain h-auto max-h-44 sm:max-h-40 rounded-none border-0  transition-transform duration-300 ease-out scale-115 cursor-zoom-in"
          loading="lazy"
          style={{ clipPath: "inset(0 0 0 1px)" }}
        />
        {product.featured && (
          <span className="absolute left-2 top-2 rounded bg-white/50 text-black  px-2 py-0.5 text-xs shadow-sm">Promoção</span>
        )}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
          <span className="rounded bg-green-600 text-black px-2 py-0.5 text-xs shadow-sm">Em estoque</span>
          {product.realPrice && product.realPrice > product.price ? (() => {
            const pct = Math.round(100 - (product.price / product.realPrice) * 100);
            return pct > 0 ? (
              <span className="rounded bg-green-600 text-white px-2 py-0.5 text-xs shadow-sm">-{pct}%</span>
            ) : null;
          })() : null}
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="text-base sm:text-base font-semibold text-black break-words">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-center gap-2">
          {product.realPrice && product.realPrice > product.price ? (
            <>
              <span className="text-xs sm:text-sm line-through text-neutral-500">{formatBRL(product.realPrice)}</span>
              <span className="text-lg sm:text-xl font-extrabold text-green-600">{formatBRL(product.price)}</span> 
              </>
            ) : 
            ( <span className="text-lg sm:text-xl font-extrabold text-green-600">{formatBRL(product.price)}</span> )}
        </div>
        <p className="mt-1 text-[12px] sm:text-[11px] text-neutral-600">ou 4x de {formatBRL(product.price / 4)} sem juros</p>
        
        <div className="mt-3 flex items-center gap-2">
          
          <button
            className="w-full inline-flex items-stretch rounded-md border border-[#00d000] bg-[#00d000] hover:bg-[#00b815] text-white text-sm"
            onClick={(e) => { e.stopPropagation(); onQuickBuy(product);  }}
          >
            <span className="flex-1 px-4 py-2 font-semibold tracking-wide uppercase text-center">Comprar</span>
            <span className="w-12 flex items-center justify-center border-l border-[#009900]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="8" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
                <path d="M16 6a3 3 0 110 6 3 3 0 010-6z" stroke="none" fill="currentColor" opacity="0" />
                
              </svg>
            </span>
          </button>
        </div>
        
        
        
      </div>
    </Motion.div>
  );
}