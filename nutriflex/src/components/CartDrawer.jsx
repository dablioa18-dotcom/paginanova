import { useEffect, useState } from "react";

export default function CartDrawer({ open, onClose, items, setItems }) {
  const [notes, setNotes] = useState("");
  const [pickup, setPickup] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem("nutriflex_cart_notes");
    const savedPickup = localStorage.getItem("nutriflex_cart_pickup");
    if (savedNotes) setNotes(savedNotes);
    if (savedPickup) setPickup(savedPickup === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("nutriflex_cart_notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("nutriflex_cart_pickup", String(pickup));
  }, [pickup]);

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const checkout = () => {
    const order = {
      items,
      notes,
      pickup,
      date: new Date().toISOString(),
          total: subtotal,
    };
    localStorage.setItem("nutriflex_last_order", JSON.stringify(order));
    clearCart();
    alert("Pedido simulado realizado! Obrigado por comprar na NutriFlex.");
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-red-500">
          <h2 className="font-semibold">Seu carrinho</h2>
          <button onClick={onClose} className="text-sm">Fechar</button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-180px)]">
          {items.length === 0 && <p className="opacity-70">Carrinho vazio.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 border-b pb-3">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-brand-red font-semibold text-sm">R$ {item.price.toFixed(2)}</p>
              </div>
              <button className="text-xs underline" onClick={() => removeItem(item.id)}>Remover</button>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">Observações (cart notes)</label>
            <textarea
              className="mt-1 w-full rounded border p-2 text-sm bg-white"
              placeholder="Ex.: Sem lactose, entregar na portaria"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} />
            Retirar na loja (in-store pickup)
          </label>
        </div>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>
              R$ {items.reduce((acc, cur) => acc + cur.price, 0).toFixed(2)}
            </span>
          </div>
          <button
            className="mt-3 w-full rounded-md bg-brand-red py-2 text-white"
            onClick={checkout}
            disabled={items.length === 0}
          >
            Finalizar compra
          </button>
        </div>
      </aside>
    </div>
  );
}