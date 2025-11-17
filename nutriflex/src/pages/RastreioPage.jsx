import { useEffect, useMemo, useState } from "react";

export default function RastreioPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  useEffect(() => {
    try {
      const code = localStorage.getItem("nutriflex_last_tracking_code");
      const ts = localStorage.getItem("nutriflex_tracking_created_at");
      if (code) setTrackingCode(code);
      if (ts) setCreatedAt(Number(ts));
      const se = localStorage.getItem("nutriflex_customer_email");
      if (se) setSavedEmail(se);
    } catch { void 0; }
  }, []);

  const elapsedMs = useMemo(() => {
    if (!createdAt) return 0;
    return Date.now() - createdAt;
  }, [createdAt]);

  const steps = useMemo(() => {
    const hours = elapsedMs / 36e5;
    return [
      { label: "Pedido recebido", done: hours >= 0 },
      { label: "Pagamento confirmado", done: hours >= 0.25 },
      { label: "Em preparação", done: hours >= 2 },
      { label: "Enviado", done: hours >= 12 },
      { label: "Em trânsito", done: hours >= 48 },
      { label: "Saiu para entrega", done: hours >= 72 },
      { label: "Entregue", done: hours >= 96 },
    ];
  }, [elapsedMs]);

  const progressPercent = useMemo(() => {
    const total = steps.length;
    const done = steps.filter((s) => s.done).length;
    return Math.round((done / total) * 100);
  }, [steps]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (savedEmail && email.trim() && savedEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
      setTrackingCode("");
    }
  };

  const copyTracking = async () => {
    if (!trackingCode) return;
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch { void 0; }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Rastreio de Pedido</h1>
      <p className="text-neutral-700 mb-4">Informe seu e-mail para visualizar o progresso do seu pedido.</p>

      <form onSubmit={onSubmit} className="rounded-md border border-neutral-200 bg-white p-4 flex items-center gap-3" aria-label="Consultar rastreio por e-mail">
        <input
          type="email"
          required
          placeholder="seuemail@exemplo.com"
          className="flex-1 rounded border border-neutral-300 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="rounded-md bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-semibold">Consultar</button>
      </form>

      {submitted && (
        <div className="mt-6 space-y-4">
          {trackingCode ? (
            <section className="rounded-md border-2 border-yellow-400 bg-yellow-50 px-4 py-3" aria-live="polite" aria-atomic="true">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 text-2xl" aria-hidden="true">📦</div>
                <div className="flex-1">
                  <div className="text-neutral-900 font-semibold">Código de rastreio</div>
                  <div className="mt-1">
                    <span className="inline-block font-mono text-lg tracking-widest bg-white text-neutral-900 px-3 py-1 rounded border border-yellow-300 select-all">{trackingCode}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-600"
                      onClick={copyTracking}
                    >
                      <span aria-hidden="true">📋</span>
                      Copiar código
                    </button>
                    {copied && <span className="text-green-700 text-sm">Copiado!</span>}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">Nenhum pedido encontrado para este e-mail neste dispositivo.</div>
          )}

          {trackingCode && (
            <section className="rounded-md border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-700">Progresso</span>
                <span className="text-neutral-900 font-medium">{progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 w-full bg-neutral-200 rounded">
                <div className="h-2 bg-green-600 rounded" style={{ width: `${progressPercent}%` }} />
              </div>

              <ul className="mt-4 space-y-2">
                {steps.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${s.done ? "bg-green-600 border-green-600 text-white" : "bg-white border-neutral-300 text-neutral-500"}`}>{s.done ? "✓" : i + 1}</span>
                    <span className={s.done ? "text-neutral-900" : "text-neutral-600"}>{s.label}</span>
                  </li>
                ))}
              </ul>

              {createdAt && (
                <div className="mt-3 text-sm text-neutral-600">Atualizado: {new Date(createdAt).toLocaleString()}</div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}