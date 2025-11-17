export const digitsOnly = (s) => String(s || "").replace(/\D/g, "");

export const formatCpfFromDigits = (digits) => {
  const d = digitsOnly(digits).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  let out = "";
  if (p1) out += p1;
  if (p2) out += "." + p2;
  if (p3) out += "." + p3;
  if (p4) out += "-" + p4;
  return out;
};

export const cpfIsValid = (cpfStr) => {
  const d = digitsOnly(cpfStr);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;
  const calc = (slice, start) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) sum += Number(slice[i]) * (start - i);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };
  const dv1 = calc(d.slice(0, 9), 10);
  const dv2 = calc(d.slice(0, 9) + String(dv1), 11);
  return d.endsWith(String(dv1) + String(dv2));
};

export const emailIsValid = (email) => {
  const v = String(email || "");
  if (!v.includes("@")) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
};