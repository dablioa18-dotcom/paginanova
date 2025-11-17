import { useEffect, useMemo, useState } from "react";
import { emailIsValid, cpfIsValid, formatCpfFromDigits } from "../utils/validation.js";

export default function PaymentPage() {
  const [items, setItems] = useState([]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [formError, setFormError] = useState("");
  const [pixKeyText, setPixKeyText] = useState("");
  const [pixQrUrl, setPixQrUrl] = useState("");
  const [pixExpiresAt, setPixExpiresAt] = useState(0);
  const [pixRemaining, setPixRemaining] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [cpfError, setCpfError] = useState("");
  

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
  const realPriceSubtotal = useMemo(
    () => grouped.reduce((sum, g) => sum + ((g.realPrice ?? 0) * g.qty), 0),
    [grouped]
  );
  useEffect(() => {
    if (!pixExpiresAt) return;
    const id = setInterval(() => {
      const rem = Math.max(0, Math.floor((pixExpiresAt - Date.now()) / 1000));
      setPixRemaining(rem);
      if (rem <= 0) {
        clearInterval(id);
        setPixError("Tempo esgotado (15min)");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [pixExpiresAt]);
  const shipping = useMemo(() => (subtotal >= 45.99 ? 0 : 45.99), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  const points = useMemo(() => Math.floor(subtotal * 5), [subtotal]);
  const methods = [
    { id: "cc", label: "Cartão de crédito" },
    { id: "pix", label: "Pix" },

  ];
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState("");
  const [pixData, setPixData] = useState(null);
  const [emailSendError, setEmailSendError] = useState("");
  const [emailSendOk, setEmailSendOk] = useState(false);

  const isEmailValid = (v) => emailIsValid(v);
  const isCpfValid = (v) => cpfIsValid(v);

  const finalize = async () => {
    if (!paymentMethod) return;
    setFormError("");
    const nameOk = Boolean(String(customerName || "").trim());
    const emailOk = isEmailValid(customerEmail);
    const cpfOk = isCpfValid(customerCpf);
    if (!nameOk || !emailOk || !cpfOk) {
      setFormError("Preencha e-mail, nome e CPF válidos");
      return;
    }
    const makeCode = () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const l1 = alphabet[Math.floor(Math.random() * alphabet.length)];
      const l2 = alphabet[Math.floor(Math.random() * alphabet.length)];
      const numbers = String(Math.floor(100000000 + Math.random() * 900000000));
      return `${l1}${l2}${numbers}`;
    };

    if (paymentMethod === "pix") {
      try {
        setPixLoading(true);
        setPixError("");
        setPixData(null);
        const isPix = paymentMethod === "pix";
        const discountFactor = isPix ? 0.9 : 1;
        const itemsPayload = grouped.map((it) => ({
          title: (it.name ?? it.title ?? "Produto"),
          unitPrice: Math.round(Number(it.price ?? 0) * 100 * discountFactor),
          quantity: Number(it.qty ?? 1),
          tangible: true,
        }));
        const amountCents = itemsPayload.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const apiBase = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE)
          || `${(typeof window !== "undefined" && window.location && window.location.protocol) ? window.location.protocol : "http:"}//${(typeof window !== "undefined" && window.location && window.location.hostname) ? window.location.hostname : "localhost"}:3001`;
        const resp = await fetch(`${apiBase}/api/pix/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountCents > 0 ? amountCents : Math.round(total * 100),
            paymentMethod: "pix",
            description: "Pedido Nutriflex",
            items: itemsPayload,
            customer: { name: customerName, email: customerEmail, document: { number: String(customerCpf || "").replace(/\D/g, ""), type: "cpf" } }
          }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          setPixError(typeof data === "object" ? JSON.stringify(data) : String(data));
      } else {
        setPixData(data);
        const key = (data && (data.qr_code_text || data.qrCodeText)) || (data && data.pix && data.pix.qrcode) || "";
        if (key) {
          setPixKeyText(key);
          setPixQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(key)}`);
          setPixExpiresAt(Date.now() + 15 * 60 * 1000);
          setPixRemaining(15 * 60);
        }
        const expected = amountCents > 0 ? amountCents : Math.round(total * 100);
        const start = Date.now();
        const timeoutMs = 900000;
        let ok = false;
        while (Date.now() - start < timeoutMs) {
          const s = await fetch(`${apiBase}/api/pix/status/${data.id}`);
          const sj = await s.json();
          if (!s.ok) {
              setPixError(typeof sj === "object" ? JSON.stringify(sj) : String(sj));
              break;
            }
            const st = String(sj.status || "");
            const paid = Number(sj.paidAmount || 0);
            const approved = ["paid", "approved", "concluded"].includes(st);
            if (approved && paid >= expected) {
              ok = true;
              break;
            }
            if (["refused", "canceled", "cancelled", "expired"].includes(st)) {
              setPixError("Pagamento recusado ou cancelado");
              break;
            }
            await new Promise((r) => setTimeout(r, 5000));
          }
          if (ok) {
            const code = makeCode();
            setTrackingCode(code);
            setPaymentConfirmed(true);
            try {
              localStorage.setItem("nutriflex_last_tracking_code", code);
              localStorage.setItem("nutriflex_tracking_created_at", String(Date.now()));
              if (customerEmail) {
                localStorage.setItem("nutriflex_customer_email", customerEmail);
              }
              if (customerName) {
                localStorage.setItem("nutriflex_customer_name", customerName);
              }
              if (customerCpf) {
                localStorage.setItem("nutriflex_customer_cpf", String(customerCpf || "").replace(/\D/g, ""));
              }
            } catch { void 0; }
            try {
              const apiBase = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE)
                || `${(typeof window !== "undefined" && window.location && window.location.protocol) ? window.location.protocol : "http:"}//${(typeof window !== "undefined" && window.location && window.location.hostname) ? window.location.hostname : "localhost"}:3001`;
              await fetch(`${apiBase}/api/pix/delivery/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "in_transit", trackingCode: code })
              });
            } catch { void 0; }
            try {
              const order = { items: grouped.map((g) => ({ title: g.name ?? g.title ?? "Produto", quantity: g.qty, unitPrice: g.price })), total };
              const apiBase = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE)
                || `${(typeof window !== "undefined" && window.location && window.location.protocol) ? window.location.protocol : "http:"}//${(typeof window !== "undefined" && window.location && window.location.hostname) ? window.location.hostname : "localhost"}:3001`;
              const resp = await fetch(`${apiBase}/api/notify/confirmation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: customerEmail, trackingCode: code, order })
              });
              const j = await resp.json();
              if (!resp.ok) {
                setEmailSendError(typeof j === "object" ? JSON.stringify(j) : String(j));
              } else {
                setEmailSendOk(true);
              }
            } catch (ee) {
              setEmailSendError(String(ee && ee.message ? ee.message : ee));
            }
            setTimeout(() => setShowPanel(true), 100);
          } else if (!ok) {
            setPixError("Tempo esgotado para confirmação");
          }
        }
      } catch (e) {
        setPixError(String(e && e.message ? e.message : e));
      } finally {
        setPixLoading(false);
      }
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

  const copyPixKey = async () => {
    if (!pixKeyText) return;
    try {
      await navigator.clipboard.writeText(pixKeyText);
    } catch { void 0; }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nutriflex_last_tracking_code");
      if (saved) setTrackingCode(saved);
    } catch { void 0; }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl font-semibold mb-6">Pagamento</h1>
      {trackingCode && paymentConfirmed && (
        <div className={`mb-4 rounded-md border-2 border-yellow-400 bg-yellow-50 px-4 py-3 transition-opacity duration-300 ${showPanel ? "opacity-100" : "opacity-0"}`} aria-live="polite" aria-atomic="true">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-2xl" aria-hidden="true">📦</div>
            <div className="flex-1">
              <div>pagamento confirmado</div>

              <div className="text-neutral-900 font-semibold"> Seu Código de rastreio</div>
              <div className="mt-1">
                <span className="inline-block font-mono text-lg tracking-widest bg-white text-neutral-900 px-3 py-1 rounded border border-yellow-300 select-all">
                  {trackingCode}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-600"
                  onClick={copyTracking}
                >
                  <span aria-hidden="true">📋</span>
                  Copiar código
                </button>
                {copied && (
                  <span className="text-green-700 text-sm">Copiado!</span>
                )}
              </div>
              <div className="mt-1 text-sm text-neutral-700">Mantenha este código para acompanhar seu pedido.</div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-md border border-neutral-400 ">
            <div className=" bg-neutral-100 px-4 py-2 text-neutral-700 font-semibold">1. Identificação</div>
            <div className="p-4">
              <div className="text-green-700 font-medium mb-2">Dados pessoais 
                <span className="text-neutral-500 text-xs">* Campos obrigatórios</span>
              </div>
              <div className="space-y-3">
                <input
                  className={`w-40 rounded border p-2 ${emailError ? "border-[#FF0000] text-[#FF0000]" : "border-neutral-100"}`}
                  placeholder="E-mail *"
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCustomerEmail(v);
                    setEmailError(emailIsValid(v) ? "" : "E-mail inválido. Use o formato nome@gmail.com");
                  }}
                />
                {emailError && (
                  <div className="text-xs" style={{ color: "#FF0000" }}>{emailError}</div>
                )}
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" /> Quero receber promoções e ofertas da ArturiaSuplements.
                  </label>
                  <span className="text-neutral-500 text-xs">CPF</span>
                   <br />
                <input
                  className={`w-50 h-5 rounded border  ${cpfError ? "border-[#FF0000] text-neutral-800" : "border-neutral-200"}`}
                  placeholder="000.000.000-00"
                  required
                  type="text"
                  inputMode="numeric"
                  value={customerCpf}
                  onChange={(e) => {
                    const digits = String(e.target.value || "").replace(/\D/g, "").slice(0,11);
                    const formatted = formatCpfFromDigits(digits);
                    setCustomerCpf(formatted);
                    let msg = "";
                    if (formatted.length !== 14) msg = "Preencha corretamente";
                    else if (!cpfIsValid(formatted)) msg = "CPF inválido";
                    setCpfError(msg);
                  }}
                />
                {cpfError && (
                  <div className="text-xs" style={{ color: "#FF0000" }}>{cpfError}</div>
                )}
                
                <input className="w-50 h-5 rounded border border-neutral-300" 
                placeholder="Nome completo *" required
                type="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)} />
                
                <input className="w-50 h-5 rounded border border-neutral-300" placeholder="Data de nascimento" />
                <div className="">
                  <input className="w-50 h-5 rounded border border-neutral-300 " placeholder="Telefone celular " />
                  
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" /> Quero receber promoções via WhatsApp.</label>
                
                <div className="text-sm">Gênero</div>
                <div className="flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="gender" /> Masculino</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="gender" /> Feminino</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="gender" /> Outro</label>
                </div>
                
                <div className="h-1 w-full bg-neutral-200 rounded" />
                <button className="w-full rounded-md border border-[#00d000] bg-[#00d000] hover:bg-[#00b815] text-white py-2 px-4 font-semibold" onClick={() => setStep(2)}>Ir para entrega</button>
                
                <div className="mt-2 text-green-700 text-sm">Compra 100% segura</div>
                <div className="text-[11px] text-neutral-600">Seus dados pessoais estão protegidos, todas as informações são criptografadas para sua segurança.</div>
              </div>
            </div>
          </section>

          <section className={`rounded-md border border-neutral-200 ${step < 2 ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="bg-neutral-100 px-4 py-2 text-neutral-700 font-semibold">2. Endereço</div>
            <div className="p-4">
              <div className="text-green-700 font-medium mb-2">Endereço de entrega</div>
              <div className="space-y-3">
                <input className="w-full rounded border border-neutral-300 p-2" placeholder="CEP *" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded border border-neutral-300 p-2" placeholder="Endereço *" />
                  <input className="rounded border border-neutral-300 p-2" placeholder="Número *" />
                </div>
                <input className="w-full rounded border border-neutral-300 p-2" placeholder="Complemento" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded border border-neutral-300 p-2" placeholder="Bairro *" />
                  <input className="rounded border border-neutral-300 p-2" placeholder="Cidade *" />
                </div>
                <input className="w-full rounded border border-neutral-300 p-2" placeholder="Estado (UF) *" />
                <button className="w-full border border-[#00d000] rounded-md bg-[#00d000] hover:bg-[#00b840] text-white py-2 px-4 font-semibold" onClick={() => setStep(3)}>Ir para pagamento</button>
                <div className="mt-2 text-green-700 text-sm">Compra 100% segura</div>
                <div className="text-[11px] text-neutral-600">100% do seu dinheiro de volta, em caso de reembolso!</div>
              </div>
            </div>
          </section>

          <section className={`rounded-md border border-neutral-200 ${step < 3 ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="bg-neutral-100 px-4 py-2 text-neutral-700 font-semibold">3. Pagamento</div>
            <div className="p-4 text-center text-neutral-700">Escolha a forma de pagamento</div>
            <div className="px-4 pb-4 space-y-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  className={`w-full rounded border border-neutral-300 bg-neutral-100 p-3 text-left transition ${paymentMethod === m.id ? "ring-2 ring-green-600 bg-neutral-50" : "hover:bg-neutral-200"}`}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  {m.label}
                </button>
              ))}
              {formError && (
                <div className="text-red-700">{formError}</div>
              )}
              {paymentMethod === "pix" && (
              <div className="mt-2 text-sm text-neutral-700">
                {pixLoading && <div className="text-neutral-700">Iniciando pagamento PIX...</div>}
                {pixError && <div className="text-red-700">Erro: {pixError}</div>}
                {pixData && (
                  <div className="space-y-1">
                    <div className="text-green-700 font-medium">PIX iniciado</div>
                    {pixRemaining > 0 && (
                      <div className="text-xs text-neutral-600">Expira em {Math.floor(pixRemaining/60)}:{String(pixRemaining%60).padStart(2,'0')}</div>
                    )}
                    {pixQrUrl && (
                      <div className="rounded-md border border-neutral-300 bg-white p-2 hidden sm:block text-center">
                        <div className="text-xs text-neutral-600">QR Code</div>
                        <img src={pixQrUrl} alt="QR Code PIX" className="h-40 w-40 object-contain mx-auto" />
                      </div>
                    )}
                    <div className="text-xs text-neutral-600"> Copia e cola a chave pix abaixo</div>
                    {pixKeyText && (
                      
                      <div className="rounded-md border border-neutral-300 bg-white p-2">
                        <div className="font-mono text-xs break-all select-all">{pixKeyText}</div>
                      
                    </div>
                    )}
                      <div className="mt-1">
                          <button className="inline-flex items-center  gap-2 rounded-md border border-neutral-300 bg-green-600 hover:bg-green-700 text-white px-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-600" onClick={copyPixKey}>
                            <span aria-hidden="true">📋</span>Copiar chave</button>
                        </div>
                  </div>
                )}
              </div>
            )}
              {emailSendOk && (
                <div className="rounded-md border border-green-300 bg-green-50 p-3 text-green-700">E-mail de confirmação enviado</div>
              )}
              {emailSendError && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700">Falha ao enviar e-mail: {emailSendError}</div>
              )}
              <div className="pt-2">
                <button
                  className="w-full rounded-md bg-[#2e7d32] hover:bg-[#276628] text-white py-2 px-4 font-semibold"
                  onClick={finalize}
                  disabled={!paymentMethod || !isEmailValid(customerEmail) || !String(customerName || "").trim() || !isCpfValid(customerCpf)}
                >
                  FECHAR PEDIDO
                </button>
              </div>
            </div>
          </section>
        </div>

        <div>
          <section className="rounded-md border border-neutral-200 bg-white">
            <div className="px-4 py-2 bg-neutral-100 text-neutral-800 font-medium">Resumo do pedido</div>
            <ul className=" list-none divide-y divide-neutral-200 " style={{ padding: "0px 15px 0px 12px" }}>
              {grouped.map((it, idx) => {
                const img = (Array.isArray(it.images) && it.images[0]) || it.image;
                return (
                  <li key={idx} className=" list-none m-0 p-0" style={{ padding: "10px 15px 10px 0px" }}>
                    <div className="flex items-center gap-3">
                      {img ? (
                        <img src={img} alt={it.name ?? it.title ?? "Produto"} className="h-12 w-12 object-contain" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-neutral-100" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{it.name ?? it.title ?? "Produto"}</div>
                        <div className="text-[11px] text-neutral-600">Quantidade: {it.qty}</div>
                        <div className="text-[11px] text-neutral-600">R$ {(it.price ?? 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between"><span className="text-neutral-700">Subtotal:</span>
              <span className="text-neutral-700">R$ {subtotal.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span className="text-neutral-700">Frete:</span>
              <span className="text-neutral-700 line-through" >R$ {shipping.toFixed(2)}</span>
             
              </div>
              <div className="flex items-center justify-between"><span className="text-neutral-700">Preço sem desconto:</span>
              <span className="text-neutral-700">R$ {realPriceSubtotal.toFixed(2)}</span>
              </div>
             
              <div className="flex items-center justify-between"><span className="text-neutral-900 font-semibold">Total com desconto aplicado:</span>
              <span className="text-xl font-semibold text-green-700">R$ {total.toFixed(2)}</span>
              </div>

              
              <div className="text-green-700 text-sm">Garanta 10% de desconto no PIX.</div>
              <div className="text-green-700 font-semibold">R$ {(subtotal * 0.90).toFixed(2)}</div>
              
              <div className="text-neutral-700 text-sm">Ganhe até {points} pontos nesta compra.</div>
              <div></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}