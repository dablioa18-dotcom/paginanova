import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HeroImageSection from "./components/HeroImageSection";
import BenefitsBar from "./components/BenefitsBar";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import WhatsAppButton from "./components/WhatsAppButton";
import { products } from "./assets/data/products";
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const RastreioPage = lazy(() => import("./pages/RastreioPage"));
import Footer from "./components/Footer";

function Home({ onQuickBuy, query }) {
  const featured = useMemo(() => products.filter((p) => p.featured), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category].some((field) => field.toLowerCase().includes(q))
    );
  }, [query]);
  const shown = useMemo(() => filtered, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <HeroImageSection />
      <BenefitsBar />



      {/* Faixa de categorias estilo chips */}
      

      <div className="space-y-4">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Destaques</h2>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((p, i) => (
              <ProductCard key={`feat-${p.id}-${i}`} product={p} onQuickBuy={onQuickBuy} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Todos os produtos</h2>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {shown.map((p, i) => (
              <ProductCard key={`all-${p.id}-${i}`} product={p} onQuickBuy={onQuickBuy} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const query = "";
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("nutriflex_cart_items");
    return saved ? JSON.parse(saved) : [];
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("nutriflex_cart_items", JSON.stringify(items));
  }, [items]);

  const onQuickBuy = (p) => {
    setItems((prev) => [{ ...p }, ...prev]);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pt-28 sm:pt-32">
      <Header onOpenCart={() => setOpen(true)} />
          <Suspense fallback={<div className="p-6">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<Home onQuickBuy={onQuickBuy} query={query} />} />
              <Route path="/product/:id" element={
                <ProductPage onQuickBuy={onQuickBuy} />
                } />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/rastreio" element={<RastreioPage />} />
            </Routes>
          </Suspense>
      <CartDrawer open={open} onClose={() => setOpen(false)} items={items} setItems={setItems} />

      {pathname !== "/checkout" && pathname !== "/payment" && (
        <button
          className="fixed bottom-4 right-4 rounded-full border border-red-500 bg-red-500 text-white px-4 py-3"
          onClick={() => setOpen(true)}
        >
          Carrinho ({items.length})
        </button>
      )}
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
