import { categories } from "../assets/data/products";

export default function CategoryMenu({ onSelect }) {
  return (
    <aside className="sm:w-64 w-full sm:sticky sm:top-4">
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-3">
        <h3 className="font-semibold mb-2 text-black uppercase">Toda a loja</h3>
        <ul className="space-y-1 text-sm">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className="w-full text-left px-2 py-1.5 text-neutral-900 hover:underline"
                onClick={() => onSelect(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1">Preço</label>
          <select className="w-full rounded border border-neutral-300 bg-white p-2 text-sm">
            <option>Todos</option>
            <option>Até R$ 100</option>
            <option>R$ 100 a R$ 200</option>
            <option>Acima de R$ 200</option>
          </select>
        </div>
      </div>
    </aside>
  );
}