import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose, items, setItems }) {
  const navigate = useNavigate();
  
  const formatBRL = (val) =>
    typeof val === "number"
      ? val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : val;
  const subtotal = useMemo(() => items.reduce((acc, cur) => acc + cur.price, 0), [items]);
  const FREE_SHIPPING = 45.99;
  const missingForFree = Math.max(0, FREE_SHIPPING - subtotal);
  const shipping = subtotal >= FREE_SHIPPING ? 0 : FREE_SHIPPING;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100));
  const grouped = useMemo(() => {
    const map = {};
    for (const it of items) {
      const key = it.id;
      if (!map[key]) map[key] = { ...it, qty: 0 };
      map[key].qty += 1;
    }
    return Object.values(map);
  }, [items]);

  const incQty = (id) =>
    setItems((prev) => {
      const base = prev.find((i) => i.id === id);
      return base ? [{ ...base }, ...prev] : prev;
    });
  const decQty = (id) =>
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  const removeGroup = (id) => setItems((prev) => prev.filter((i) => i.id !== id));


  return (
    <div className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 transition-opacity ${open ? "opacity-100" : "opacity-0"} bg-black/25 sm:bg-black/40`}
        onClick={onClose}
      />

      <aside
        className={`absolute bottom-0 right-0 top-0 h-full sm:w-[500px] md:w-[480px] lg:w-[520px] bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center  text-black">
             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              
            </span>
            <span className=" flex text-lg font-semibold align-center" > Itens no Carrinho ({grouped.length})</span>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-full border border-neutral-300 flex items-center justify-center">
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="px-3 sm:px-4 pt-3">
          <div className="rounded-md bg-green-100 p-3">
            <div className="text-sm"><span className="text-green-700">Faltam {formatBRL(missingForFree)}</span> para <span className="font-semibold">FRETE GRÁTIS</span></div>
            <div className="mt-2">
              <div className="relative h-2 w-full rounded bg-green-200">
                <div className="h-2 rounded bg-green-600" style={{ width: `${progress}%` }} />
                <div className="absolute -top-1 h-4 w-4 rounded-full border-2 border-green-600 bg-white" style={{ left: `calc(${progress}% - 8px)` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {grouped.length === 0 && <p className="opacity-70 text-center uppercase">Carrinho vazio</p>}
          {grouped.map((item) => (
            <div key={item.id} className="rounded-md border p-2 sm:p-3 bg-white"> 
              <div className="flex items-start gap-3">
                {(() => {
                  const src = (Array.isArray(item.images) && item.images[0]) || item.image;
                  return src ? (
                    <img src={src} alt={item.name} className="h-12 w-12 sm:h-14 sm:w-14 object-contain" />
                  ) : (
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded bg-neutral-100" aria-hidden="true" />
                  );
                })()}
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  {item.size && <p className="text-xs text-neutral-700">Tamanho: {item.size}</p>}
                  {item.flavor && <p className="text-xs text-neutral-700">Sabor: {item.flavor}</p>}
                  {item.realPrice && item.realPrice > item.price ? (
                    <div className="mt-1 text-xs">
                      <span className="text-neutral-600">De: {formatBRL(item.realPrice)}</span>
                      <div className="mt-1 inline-block rounded bg-red-100 px-2 py-1 text-red-700 font-semibold">Por: {formatBRL(item.price)}</div>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs">
                      <span className="text-neutral-800">Preço:</span> 
                      <span className="font-semibold">{formatBRL(item.price)}</span></div>
                  )}
                </div>
                <button
                  aria-label="Remover"
                  className="h-8 w-8 rounded-md border flex items-center justify-center"
                  onClick={() => removeGroup(item.id)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2m-1 4v9m-6-9v9"/></svg>
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center rounded-md overflow-hidden">
                  <button className="h-7 w-7 sm:h-8 sm:w-8 bg-neutral-200 border border-neutral-300" onClick={() => decQty(item.id)}>-</button>
                  <span className="h-7 w-7 sm:h-8 sm:w-10 bg-white  border-neutral-300 flex items-center justify-center">{item.qty}</span>
                  <button className="h-7 w-7 sm:h-8 sm:w-8 bg-neutral-800 text-white border border-neutral-300" onClick={() => incQty(item.id)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 sm:px-4 py-4 space-y-3 border-t">
          <div className="rounded-md border border-neutral-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm font-medium">{formatBRL(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Frete</span>
              <span className="text-sm font-medium">{formatBRL(shipping)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm">Total</span>
              <span className="text-sm font-semibold">{formatBRL(subtotal + shipping)}</span>
            </div>
            <div className="mt-1 text-xs">
              <span className="line-through text-neutral-500">{formatBRL(subtotal)}</span>
              <span className="ml-2 text-green-700 font-semibold">{formatBRL(subtotal * 0.9)}</span>
            </div>
            <div className="mt-1 text-xs text-green-700">*Valor com 10% de desconto no boleto ou PIX.</div>
           
          </div>

          <div className="flex items-center gap-2 text-green-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="8" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>
            <span className="text-sm">Envio e entrega rápida, 99% das entregas foram realizadas antes do prazo, conforme estudo Ebit.</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button className="w-full rounded-md bg-[#2e7d32] hover:bg-[#276628] text-white py-3 px-4 font-semibold" onClick={() => { navigate('/checkout'); onClose(); }} disabled={items.length === 0}>IR PARA O PAGAMENTO</button>
            <span className="text-sm font-medium  justify-center items-center flex ">ou</span>
            <button className="w-full rounded-md border-2 border-neutral-300 bg-neutral-100 text-neutral-900 py-3 px-4 font-semibold" onClick={onClose}>Escolher mais produtos</button>
          </div>
          <div className="text-sm text-neutral-700">Ou em até 8x de {formatBRL(subtotal / 8)} sem juros</div>
        </div>
        </div>
      </aside>
    </div>
  );
}