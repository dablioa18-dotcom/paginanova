import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("nutriflex_theme") === "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("nutriflex_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("nutriflex_theme", "light");
    }
  }, [dark]);

  return (
    <button
      className="rounded-md border px-3 py-1.5 text-sm"
      onClick={() => setDark((v) => !v)}
    >
      {dark ? "Light" : "Dark"} mode
    </button>
  );
}