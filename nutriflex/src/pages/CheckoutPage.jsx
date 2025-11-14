import { useEffect, useMemo, useState } from "react";

export default function CheckoutPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nutriflex_cart_items");
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setItems([]);
    }
  }, []);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.totalPrice ?? it.price ?? 0), 0),
    [items]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      {items.length === 0 ? (
        <p className="text-neutral-700">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-md border border-neutral-200 bg-white">
            <div className="p-4 border-b border-neutral-200 font-medium">Itens</div>
            <ul className="divide-y divide-neutral-200">
              {items.map((it, idx) => (
                <li key={idx} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{it.name ?? it.title ?? "Produto"}</div>
                    <div className="text-sm text-neutral-600">
                      Qty: {it.quantity ?? 1}
                    </div>
                  </div>
                  <div className="text-green-700 font-semibold">
                    R$ {(it.totalPrice ?? it.price ?? 0).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-neutral-200 bg-white p-4 flex items-center justify-between">
            <span className="text-neutral-700">Total</span>
            <span className="text-xl font-semibold text-green-700">R$ {total.toFixed(2)}</span>
          </div>

          <button className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-green-600 hover:bg-green-700 px-4 py-3 text-white font-semibold">
            Finalizar compra
          </button>
        </div>
      )}
    </div>
  );
}