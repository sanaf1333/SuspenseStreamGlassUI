/* 
  Decision log:
  - Two state persistence options: localStorage vs cookies.
    -> Chose localStorage (simpler for demo; no server roundtrip).
  - Two UI options: dropdown theme selector vs binary toggle.
    -> Chose binary toggle (light/dark) for minimal teaching and to avoid bikeshedding.
*/

"use client";

import { useEffect, useState } from "react";

const LIGHT = "glasslight";
const DARK = "glassdark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(LIGHT);

  useEffect(() => {
    // Initialize from localStorage or default env
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const initial = saved || process.env.NEXT_PUBLIC_THEME_DEFAULT || LIGHT;

    setTheme(initial);
    // Apply to <html data-theme="..."> for DaisyUI
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === LIGHT ? DARK : LIGHT;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <div
      className="tooltip tooltip-bottom"
      data-tip={theme === LIGHT ? "Switch to dark" : "Switch to light"}
    >
      <button
        className="btn btn-ghost btn-circle hover:bg-base-200/60"
        onClick={toggle}
        aria-label={theme === LIGHT ? "Enable dark mode" : "Enable light mode"}
        title={theme === LIGHT ? "Enable dark mode" : "Enable light mode"}
      >
        {theme === LIGHT ? (
          // Moon icon for dark mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" />
            <path
              d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}