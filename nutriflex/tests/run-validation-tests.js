import { emailIsValid, cpfIsValid, formatCpfFromDigits } from "../src/utils/validation.js";

const cases = [];
const add = (name, fn) => cases.push({ name, fn });
const eq = (a, b) => a === b;

add("format cpf basic", () => {
  const out = formatCpfFromDigits("52998224725");
  if (!eq(out, "529.982.247-25")) throw new Error("format failed: " + out);
});

add("cpf valid known", () => {
  if (!cpfIsValid("529.982.247-25")) throw new Error("cpf should be valid");
});

add("cpf invalid repeated", () => {
  if (cpfIsValid("000.000.000-00")) throw new Error("cpf should be invalid");
});

add("email valid simple", () => {
  if (!emailIsValid("a@b.com")) throw new Error("email should be valid");
});

add("email valid subdomain", () => {
  if (!emailIsValid("john.doe@sub.domain.com")) throw new Error("email should be valid");
});

add("email invalid missing at", () => {
  if (emailIsValid("userdomain.com")) throw new Error("email should be invalid");
});

add("email invalid no domain", () => {
  if (emailIsValid("user@")) throw new Error("email should be invalid");
});

add("email invalid no dot", () => {
  if (emailIsValid("user@domain")) throw new Error("email should be invalid");
});

let failed = 0;
for (const c of cases) {
  try {
    c.fn();
    console.log("PASS:", c.name);
  } catch (e) {
    failed += 1;
    console.error("FAIL:", c.name, String(e && e.message || e));
  }
}
if (failed) {
  throw new Error("Tests failed: " + failed);
}
console.log("All tests passed", cases.length);