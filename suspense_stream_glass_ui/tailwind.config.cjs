/* 
  Decision:
  - In a .cjs config, use CommonJS exports so Tailwind can load the file.
  - 'export default' in a CJS file prevents Tailwind from seeing DaisyUI plugin and themes.
*/

const config = {
  content: [
    // Scan files in the src directory (we used --src-dir).
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Optional: Extend defaults later (e.g., glass gradients, animations).
      // Keeping minimal for now; DaisyUI provides component styles.
    },
  },
  plugins: [
    // DaisyUI is a Tailwind plugin that adds component classes and themes.
    require("daisyui"),
  ],
  // @ts-expect-error - daisyui is provided by the plugin; types are augmented separately
  daisyui: {
    // Decision:
    // - Option A: Built-in themes like 'light'/'dark'.
    // - Option B: Custom themes to learn tokens.
    // -> Using custom themes to practice tokens and better glass contrast.
    themes: [
      {
        glasslight: {
          // Tokens chosen for medium saturation to read well over blur.
          primary: "#60A5FA", // blue-400
          secondary: "#F472B6", // pink-400
          accent: "#34D399", // emerald-400
          neutral: "#374151", // gray-700
          "base-100": "#FFFFFF",
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
          info: "#38BDF8",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      {
        glassdark: {
          // Dark tokens keep contrast while feeling soft for glass.
          primary: "#93C5FD", // blue-300
          secondary: "#F9A8D4", // pink-300
          accent: "#6EE7B7", // emerald-300
          neutral: "#1F2937", // gray-800
          "base-100": "#0F172A", // slate-900-like
          "base-200": "#111827",
          "base-300": "#1F2937",
          info: "#38BDF8",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
    // Decision:
    // - Option A: 'darkTheme' set to our custom dark for toggle consistency.
    // - Option B: rely on built-in 'dark'.
    // -> Use custom 'glassdark' to keep token symmetry.
    darkTheme: "glassdark",
  },
};

// Ensure Tailwind loads this config in CJS environments
module.exports = config;
