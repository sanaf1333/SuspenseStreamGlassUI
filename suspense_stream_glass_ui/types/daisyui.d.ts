/* 
  Decision log:
  - We already augmented 'tailwindcss/types/config'. Some editors resolve types
    via the root 'tailwindcss' module, still missing our augmentation.
  - Two options:
    A) Switch to JS config to avoid TS checks.
    B) Also augment the root 'tailwindcss' module to cover both resolution paths.
  -> Chose B to keep TS safety and avoid suppressions.
*/

declare module "tailwindcss/types/config" {
  interface DaisyUIThemeTokens {
    // DaisyUI themes are token maps; we keep it flexible for teaching.
    [token: string]: string;
  }

  interface DaisyUICustomTheme {
    // Named theme object: { themename: { token: value, ... } }
    [themeName: string]: DaisyUIThemeTokens;
  }

  interface DaisyUIConfig {
    // 'themes' can be true/false, built-in theme names, or custom theme objects.
    themes?: (boolean | string | DaisyUICustomTheme)[];
    darkTheme?: string;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    logs?: boolean;
    rtl?: boolean;
    prefix?: string;
    themeRoot?: string;
  }

  // Tailwind’s config types used by TypeScript during checking:
  interface UserConfig {
    daisyui?: DaisyUIConfig;
  }

  interface Config {
    daisyui?: DaisyUIConfig;
  }
}

declare module "tailwindcss" {
  // Re-declare a minimal DaisyUIConfig shape at the root for clarity.
  interface DaisyUIThemeTokens {
    [token: string]: string;
  }

  interface DaisyUICustomTheme {
    [themeName: string]: DaisyUIThemeTokens;
  }

  interface DaisyUIConfig {
    themes?: (boolean | string | DaisyUICustomTheme)[];
    darkTheme?: string;
    base?: boolean;
    styled?: boolean;
    utils?: boolean;
    logs?: boolean;
    rtl?: boolean;
    prefix?: string;
    themeRoot?: string;
  }

  interface UserConfig {
    daisyui?: DaisyUIConfig;
  }

  interface Config {
    daisyui?: DaisyUIConfig;
  }
}

export {};
