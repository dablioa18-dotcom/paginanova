import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

 

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nutriflex_cart_items");
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  
  const grouped = useMemo(() => {
    const map = {};
    for (const it of items) {
      const key = it.id ?? it.name ?? it.title;
      if (!map[key]) map[key] = { ...it, qty: 0 };
      map[key].qty += 1;
    }
    return Object.values(map);
  }, [items]);

  const subtotal = useMemo(
    () => grouped.reduce((sum, g) => sum + (g.price ?? 0) * g.qty, 0),
    [grouped]
  );

  const shipping = useMemo(() => {
    if (subtotal <= 0) return 0;
    const threshold = 45.99;
    return subtotal >= threshold ? 0 : 45.99;
  }, [subtotal]);

  const grandTotal = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  

  const persist = (next) => {
    localStorage.setItem("nutriflex_cart_items", JSON.stringify(next));
    setItems(next);
  };

  const incQty = (id) => {
    const base = items.find((i) => (i.id ?? i.name ?? i.title) === id);
    if (!base) return;
    persist([base, ...items]);
  };

  const decQty = (id) => {
    const idx = items.findIndex((i) => (i.id ?? i.name ?? i.title) === id);
    if (idx === -1) return;
    const next = [...items];
    next.splice(idx, 1);
    persist(next);
  };

  const removeGroup = (id) => persist(items.filter((i) => (i.id ?? i.name ?? i.title) !== id));

 

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-semibold mb-6">Meu carrinho </h1>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-neutral-700">Seu carrinho está vazio.</p>
          <button className=" border border-neutral-400 rounded-md bg-[#2e7d32] hover:bg-[#276628] text-white px-4 py-2 font-semibold" onClick={() => navigate('/')}>Voltar para a loja</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="rounded-md border border-neutral-200 bg-white">
              <div className="px-3 py-3 sm:p-4 border-b border-neutral-200 font-medium">Itens</div>
              <div className="hidden md:grid grid-cols-12 px-3 sm:px-4 py-2 text-xs sm:text-sm text-neutral-600 border-b border-neutral-200">
               
                <div className="col-span-2 text-center">Preço</div>
                <div className="col-span-2 text-center">Quantidade</div>
                <div className="col-span-2 text-right">Total</div>
                
              </div>
              <ul className="list-none m-0 p-0 divide-y divide-neutral-200">
                {grouped.map((it) => {
                  const id = it.id ?? it.name ?? it.title;
                  const rowTotal = (it.price ?? 0) * it.qty;
                  const img = (Array.isArray(it.images) && it.images[0]) || it.image;
                  return (
                    <li key={id} className="rounded-md border border-neutral-200 bg-white p-3 sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {img ? (
                          <img src={img} alt={it.name ?? it.title ?? "Produto"} className="h-14 w-14 sm:h-16 sm:w-16 object-contain" />
                        ) : (
                          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded bg-neutral-100" aria-hidden="true" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{it.name ?? it.title ?? "Produto"}</div>
                          <div className="text-[11px] sm:text-xs text-green-700">Em estoque. Envio imediato</div>
                            <button aria-label="Remover item" className="mt-1 inline-flex items-center rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-[11px] sm:text-xs text-neutral-700" onClick={() => removeGroup(id)}>Remover</button>
                        
                        
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-12 text-[11px] sm:text-xs bg-neutral-100 rounded">
                        <div className="col-span-4 py-2 px-3 text-center font-medium">Preço</div>
                        <div className="col-span-4 py-2 px-3 text-center font-medium">Quantidade</div>
                        <div className="col-span-4 py-2 px-3 text-center font-medium">Total</div>
                      </div>
                      <div className="grid grid-cols-12 items-center gap-2 sm:gap-3 mt-1">
                        <div className="col-span-4">
                          
                          <div className="text-left"> 
                              Produto:
                            
                            {it.realPrice && it.realPrice > (it.price ?? 0) && (
                              <div className="text-neutral-500 line-through">R$ {Number(it.realPrice).toFixed(2)}</div>
                            )}
                            <div className={(it.realPrice && it.realPrice > (it.price ?? 0)) ? "text-green-700 font-semibold" : "text-neutral-800 font-semibold"}>R$ {Number(it.price ?? 0).toFixed(2)}</div>
                          
                          </div>
                        </div>
                        <div className="col-span-4 flex items-center justify-center">
                          
                          <div className=" inline-flex items-center rounded-md overflow-hidden" role="group" aria-label="Alterar quantidade">
                            <button className="h-8 w-8 bg-neutral-200  rounded-sm border border-neutral-300" onClick={() => decQty(id)} aria-label="Diminuir">-</button>
                            <span className="h-10 w-8 bg-white  border-neutral-300 flex items-center justify-center">{it.qty}</span>
                            
                            <button className="h-8 w-8 bg-neutral-800 rounded-sm text-white border border-neutral-300" onClick={() => incQty(id)} aria-label="Aumentar">+</button>
                          </div>
                        </div>
                      
                        <div className="col-span-4 text-right text-green-700 font-semibold">R$ {rowTotal.toFixed(2)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4 rounded-md border border-neutral-200 bg-white p-4">
              <div className="font-medium mb-2">Entrega</div>
              <div className="flex gap-2">
                <input className="flex-1 rounded-md border border-neutral-300 p-2" placeholder="Digite seu CEP" />
                <button className="rounded-md bg-neutral-900 text-white px-4 py-2">Calcular</button>
              </div>
              <div className="mt-2 text-sm text-green-700">Saiba se você tem Frete Grátis</div>
              <div className="mt-3">
                <div className="font-medium mb-1">Aplicar código de cupom</div>
                <div className="flex gap-2">
                  <input className="flex-1 rounded-md border border-neutral-300 p-2" placeholder="Digite o cupom" />
                  <button className="rounded-md border border-neutral-300 bg-neutral-100 px-4 py-2">Aplicar</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <section className="border border-neutral-200 rounded-md bg-white">
              <div className="p-4 border-b border-neutral-200 font-medium">Resumo do pedido</div>
              <div className="p-4 flex items-center justify-between border-b border-neutral-200">
                <span className="text-neutral-700">Subtotal</span>
                <span className="text-neutral-700">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="p-4 flex items-center justify-between border-b border-neutral-200">
                <span className="text-neutral-700">Entrega</span>
                <span className="text-neutral-700">R$ {shipping.toFixed(2)}</span>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-neutral-700">Total</span>
                <span className="text-xl font-semibold text-green-700">R$ {grandTotal.toFixed(2)}</span>
              </div>
              <div className="px-4 pb-4 text-sm">
                <div>
                  <span className="line-through text-neutral-500">R$ {subtotal.toFixed(2)}</span>
                  <span className="ml-2 text-green-700 font-semibold">R$ {(subtotal * 0.8).toFixed(2)}</span>
                </div>
                <div className="text-green-700">*Valor com 20% de desconto no boleto ou PIX.</div>
                
              </div>

              <div className="px-4 pb-4 grid gap-2">
                <button className="  border border-[#2e7d32] rounded-md bg-[#2e7d32] hover:bg-[#276628] text-white py-2 px-4 font-semibold" onClick={() => navigate('/payment')}>FINALIZAR COMPRA</button>
                <span className="text-neutral-500-semibold flex justify-center">ou</span>
                <button className=" rounded-md border-2 border-neutral-100 bg-neutral-100 text-neutral-900 py-2 px-4 font-semibold" onClick={() => navigate('/')}>Adicionar mais produtos</button>
              </div>

              
            </section>
          </div>

        </div>
      )}
    </div>
  );
}