import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { products } from "../assets/data/products";

export default function ProductPage({ onQuickBuy }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  const formatBRL = (val) =>
    typeof val === "number"
      ? val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : val;

  const initialWeight = product?.id?.toLowerCase().includes("900g")
    ? "900g"
    : product?.id?.toLowerCase().includes("1kg")
    ? "1kg"
    : "Único";
  const [weight, setWeight] = useState(initialWeight);
  const [flavor, setFlavor] = useState(product?.variants?.[0]?.id ?? "");
  const variantImg = useMemo(() => {
    const v = product?.variants?.find((x) => x.id === flavor);
    return (v && (v.image || (typeof v.images === "string" ? v.images : null))) || null;
  }, [product, flavor]);

  if (!product) {
    return <div className="p-6">Produto não encontrado.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="text-xs text-neutral-600 mb-4">
        <Link to="/" className="underline">Início</Link>
        <span className="mx-1">/</span>
        <span className="uppercase">Loja</span>
        <span className="mx-1">/</span>
        <span className="font-medium">{product.name}{product.brand ? ` - ${product.brand}` : ""}</span>
      </nav>
      <div className="grid sm:grid-cols-2 gap-6">
        <Gallery product={product} selectedVariantImage={variantImg} />

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {product.brand && <p className="mt-1 text-sm opacity-80">Marca: {product.brand}</p>}
          {product.isKit && <span className="mt-2 inline-block rounded bg-neutral-900 text-white px-2 py-1 text-xs">Kit</span>}
          <p className="mt-2">Categoria: {product.category}</p>
          <div className="mt-4 flex items-center gap-3">
            {product.realPrice && product.realPrice > product.price ? (
              <>
                <span className="text-lg line-through text-neutral-500">{formatBRL(product.realPrice)}</span>
                <span className="text-2xl font-bold text-brand-red">{formatBRL(product.price)}</span>
                {(() => {
                  const pct = Math.round(100 - (product.price / product.realPrice) * 100);
                  return pct > 0 ? (
                    <span className="inline-flex items-center rounded bg-green-600 text-white px-2 py-0.5 text-xs">-{pct}%</span>
                  ) : null;
                })()}
              </>
            ) : (
              <span className="text-2xl font-bold text-brand-red">{formatBRL(product.price)}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-700">ou 5x de {formatBRL(product.price / 5)} sem juros</p>

          {product.variants?.length ? (
            <VariantsSelector product={product} selected={flavor} setSelected={setFlavor} />
          ) : null}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Peso</label>
              <select
                className="w-full rounded border border-neutral-300 bg-white p-2 text-sm"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              >
                {[initialWeight].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sabor</label>
              <select
                className="w-full rounded border border-neutral-300 bg-white p-2 text-sm"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
              >
                {product.variants?.length ? (
                  product.variants.map((v) => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))
                ) : (
                  <option value="">Selecionar</option>
                )}
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm opacity-80">
            Descrição: suplemento de alta qualidade para performance e saúde. Ideal para
            quem busca resultados e praticidade.
          </p>
          <AddToCartButton onQuickBuy={onQuickBuy} product={product} />
        </div>
      </div>
    </div>
  );
}

function Gallery({ product, selectedVariantImage }) {
  const images = useMemo(() => {
    const base = product.images?.length ? product.images : [product.image];
    return (Array.isArray(base) ? base.filter((x) => !!x) : []).length ? base.filter((x) => !!x) : [product.image].filter((x) => !!x);
  }, [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const main = selectedVariantImage || images[activeIndex];

  return (
    <div className="group overflow-hidden">
      <img src={main} alt={product.name} className="object-contain w-full h-auto max-h-80 rounded-none border-0 transition-transform duration-300 ease-out group-hover:scale-110 cursor-zoom-in" style={{ clipPath: "inset(0 0 0 1px)" }} />
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              className={`rounded-lg overflow-hidden border ${i === activeIndex ? "border-neutral-900" : "border-neutral-300"}`}
              onClick={() => setActiveIndex(i)}
            >
              <img src={src} alt={`${product.name} ${i + 1}`} className="h-16 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantsSelector({ product, selected, setSelected }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium">Sabores</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {product.variants.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelected(v.id)}
            className={`px-3 py-1.5 rounded-md text-sm border ${selected === v.id ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-900 border-neutral-300"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AddToCartButton({ onQuickBuy, product }) {
  const [qty, setQty] = useState(1);
  const add = () => {
    for (let i = 0; i < qty; i++) onQuickBuy(product);
  };
  return (
    <div className="mt-6 flex items-center gap-3">
      <input
        type="number"
        className="w-20 rounded border border-neutral-300 bg-white p-2 text-sm"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
      />
      <button
        className="rounded-md bg-brand-red px-4 py-2 text-white"
        onClick={add}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}