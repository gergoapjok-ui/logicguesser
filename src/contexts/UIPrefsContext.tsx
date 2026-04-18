import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type FontSize = "small" | "medium" | "large";

interface UIPrefs {
  animations: boolean;
  particles: boolean;
  compactMode: boolean;
  fontSize: FontSize;
  highContrast: boolean;
}

const DEFAULTS: UIPrefs = {
  animations: true,
  particles: true,
  compactMode: false,
  fontSize: "medium",
  highContrast: false,
};

interface UIPrefsContextType extends UIPrefs {
  setPref: <K extends keyof UIPrefs>(key: K, value: UIPrefs[K]) => void;
}

const UIPrefsContext = createContext<UIPrefsContextType>({
  ...DEFAULTS,
  setPref: () => {},
});

export const useUIPrefs = () => useContext(UIPrefsContext);

function loadPrefs(): UIPrefs {
  try {
    const raw = localStorage.getItem("ui_prefs");
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function applyPrefs(prefs: UIPrefs) {
  const root = document.documentElement;
  root.classList.toggle("no-anim", !prefs.animations);
  root.classList.toggle("no-particles", !prefs.particles);
  root.classList.toggle("compact", prefs.compactMode);
  root.classList.toggle("high-contrast", prefs.highContrast);
  root.dataset.fontSize = prefs.fontSize;
  const sizes: Record<FontSize, string> = { small: "14px", medium: "16px", large: "18px" };
  root.style.fontSize = sizes[prefs.fontSize];
}

export function UIPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<UIPrefs>(loadPrefs);

  useEffect(() => {
    applyPrefs(prefs);
    localStorage.setItem("ui_prefs", JSON.stringify(prefs));
  }, [prefs]);

  const setPref = <K extends keyof UIPrefs>(key: K, value: UIPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  return (
    <UIPrefsContext.Provider value={{ ...prefs, setPref }}>
      {children}
    </UIPrefsContext.Provider>
  );
}
