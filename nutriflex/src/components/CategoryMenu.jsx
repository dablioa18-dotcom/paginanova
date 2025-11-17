
export default function CategoryMenu({ onSelect, onPriceChange, priceFilter = "all" }) {
  return (
    <aside className="sm:w-64 w-full sm:sticky sm:top-4">
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-3">
        <h3 className="font-semibold mb-2 text-black uppercase">Toda a loja</h3>
      
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1">Preço</label>
          <select
            className="w-full rounded border border-neutral-300 bg-white p-2 text-sm"
            onChange={(e) => {
              const v = e.target.value;
              if (v === "all") onSelect?.(null);
              onPriceChange?.(v);
            }}
            defaultValue="all"
          >
            <option value="all">Todos</option>
            <option value="lt100">Até R$ 100</option>
            <option value="100-200">R$ 100 a R$ 200</option>
            <option value="gt200">Acima de R$ 200</option>
          </select>
          <section className="mt-2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-2 text-xs text-neutral-700">
            <span className="font-medium">Preço selecionado:</span>
            <span className="ml-1">
              {priceFilter === "lt100" ? "Até R$ 100" : priceFilter === "100-200" ? "R$ 100 a R$ 200" : priceFilter === "gt200" ? "Acima de R$ 200" : "Todos"}
            </span>
          </section>
        </div>
      </div>
    </aside>
  );
}