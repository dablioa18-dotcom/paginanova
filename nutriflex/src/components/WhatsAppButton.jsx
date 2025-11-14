export default function WhatsAppButton() {
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os suplementos da NutriFlex.");
  const href = `https://wa.me/5500000000000?text=${message}`; // ajuste com seu número
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-green-500 text-white shadow-lg px-4 py-3 font-semibold hover:opacity-90"
    >
      WhatsApp
    </a>
  );
}