import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface AppTheme {
  id: string;
  name: string;
  emoji: string;
  price: number;
  proOnly: boolean;
  description: string;
  vars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export const APP_THEMES: AppTheme[] = [
  {
    id: "theme_default",
    name: "Neon Matrix",
    emoji: "🟢",
    price: 0,
    proOnly: false,
    description: "The classic green neon look",
    vars: { light: {}, dark: {} },
  },
  {
    id: "theme_mint",
    name: "Mint Breeze",
    emoji: "🌿",
    price: 500,
    proOnly: false,
    description: "Fresh mint green tones",
    vars: {
      light: {
        "--primary": "160 70% 45%",
        "--ring": "160 70% 45%",
        "--neon": "160 70% 45%",
        "--neon-purple": "175 65% 50%",
        "--accent": "175 65% 50%",
      },
      dark: {
        "--primary": "160 70% 50%",
        "--ring": "160 70% 50%",
        "--neon": "160 70% 50%",
        "--neon-purple": "175 65% 55%",
        "--accent": "175 65% 55%",
      },
    },
  },
  {
    id: "theme_lavender",
    name: "Lavender Dream",
    emoji: "💜",
    price: 500,
    proOnly: false,
    description: "Soft purple haze",
    vars: {
      light: {
        "--primary": "265 60% 60%",
        "--ring": "265 60% 60%",
        "--neon": "265 60% 60%",
        "--neon-purple": "280 55% 65%",
        "--accent": "280 55% 65%",
      },
      dark: {
        "--primary": "265 60% 65%",
        "--ring": "265 60% 65%",
        "--neon": "265 60% 65%",
        "--neon-purple": "280 55% 68%",
        "--accent": "280 55% 68%",
      },
    },
  },
  {
    id: "theme_coral",
    name: "Coral Reef",
    emoji: "🪸",
    price: 500,
    proOnly: false,
    description: "Warm coral and peach tones",
    vars: {
      light: {
        "--primary": "12 80% 60%",
        "--ring": "12 80% 60%",
        "--neon": "12 80% 60%",
        "--neon-purple": "340 70% 60%",
        "--accent": "340 70% 60%",
      },
      dark: {
        "--primary": "12 80% 62%",
        "--ring": "12 80% 62%",
        "--neon": "12 80% 62%",
        "--neon-purple": "340 70% 62%",
        "--accent": "340 70% 62%",
      },
    },
  },
  {
    id: "theme_slate",
    name: "Slate Steel",
    emoji: "🔩",
    price: 500,
    proOnly: false,
    description: "Industrial cool grey-blue",
    vars: {
      light: {
        "--primary": "210 25% 50%",
        "--ring": "210 25% 50%",
        "--neon": "210 25% 50%",
        "--neon-purple": "220 20% 55%",
        "--accent": "220 20% 55%",
      },
      dark: {
        "--primary": "210 30% 60%",
        "--ring": "210 30% 60%",
        "--neon": "210 30% 60%",
        "--neon-purple": "220 25% 62%",
        "--accent": "220 25% 62%",
      },
    },
  },
  {
    id: "theme_cyberpunk",
    name: "Cyberpunk City",
    emoji: "🌆",
    price: 5000,
    proOnly: false,
    description: "Hot pink neon with electric blue accents",
    vars: {
      light: {
        "--primary": "330 85% 50%",
        "--ring": "330 85% 50%",
        "--neon": "330 85% 50%",
        "--neon-purple": "200 90% 55%",
        "--accent": "200 90% 55%",
      },
      dark: {
        "--primary": "330 85% 55%",
        "--ring": "330 85% 55%",
        "--neon": "330 85% 55%",
        "--neon-purple": "200 90% 60%",
        "--accent": "200 90% 60%",
      },
    },
  },
  {
    id: "theme_ocean",
    name: "Deep Ocean",
    emoji: "🌊",
    price: 5000,
    proOnly: false,
    description: "Cool blue depths with aqua glow",
    vars: {
      light: {
        "--primary": "210 90% 50%",
        "--ring": "210 90% 50%",
        "--neon": "210 90% 50%",
        "--neon-purple": "185 80% 45%",
        "--accent": "185 80% 45%",
        "--neon-amber": "185 80% 50%",
      },
      dark: {
        "--primary": "210 90% 55%",
        "--ring": "210 90% 55%",
        "--neon": "210 90% 55%",
        "--neon-purple": "185 80% 50%",
        "--accent": "185 80% 50%",
        "--neon-amber": "185 80% 55%",
        "--background": "215 35% 6%",
      },
    },
  },
  {
    id: "theme_sunset",
    name: "Sunset Blaze",
    emoji: "🌅",
    price: 8000,
    proOnly: false,
    description: "Warm oranges and fiery reds",
    vars: {
      light: {
        "--primary": "25 95% 53%",
        "--ring": "25 95% 53%",
        "--neon": "25 95% 53%",
        "--neon-purple": "0 80% 55%",
        "--accent": "0 80% 55%",
      },
      dark: {
        "--primary": "25 95% 55%",
        "--ring": "25 95% 55%",
        "--neon": "25 95% 55%",
        "--neon-purple": "0 80% 58%",
        "--accent": "0 80% 58%",
        "--background": "15 30% 7%",
      },
    },
  },
  {
    id: "theme_arctic",
    name: "Arctic Frost",
    emoji: "❄️",
    price: 8000,
    proOnly: false,
    description: "Icy whites and crystal blues",
    vars: {
      light: {
        "--primary": "195 85% 50%",
        "--ring": "195 85% 50%",
        "--neon": "195 85% 50%",
        "--neon-purple": "220 70% 65%",
        "--accent": "220 70% 65%",
        "--background": "210 30% 97%",
      },
      dark: {
        "--primary": "195 85% 55%",
        "--ring": "195 85% 55%",
        "--neon": "195 85% 55%",
        "--neon-purple": "220 70% 68%",
        "--accent": "220 70% 68%",
        "--background": "220 30% 8%",
      },
    },
  },
  {
    id: "theme_royal",
    name: "Royal Gold",
    emoji: "👑",
    price: 15000,
    proOnly: true,
    description: "Regal purple with gold highlights",
    vars: {
      light: {
        "--primary": "270 70% 55%",
        "--ring": "270 70% 55%",
        "--neon": "270 70% 55%",
        "--neon-purple": "45 95% 55%",
        "--neon-amber": "45 95% 55%",
        "--accent": "45 95% 55%",
      },
      dark: {
        "--primary": "270 70% 60%",
        "--ring": "270 70% 60%",
        "--neon": "270 70% 60%",
        "--neon-purple": "45 95% 58%",
        "--neon-amber": "45 95% 58%",
        "--accent": "45 95% 58%",
        "--background": "265 30% 7%",
      },
    },
  },
  {
    id: "theme_blood_moon",
    name: "Blood Moon",
    emoji: "🌑",
    price: 15000,
    proOnly: true,
    description: "Dark crimson with eerie glow",
    vars: {
      light: {
        "--primary": "0 75% 45%",
        "--ring": "0 75% 45%",
        "--neon": "0 75% 45%",
        "--neon-purple": "340 70% 50%",
        "--accent": "340 70% 50%",
      },
      dark: {
        "--primary": "0 75% 50%",
        "--ring": "0 75% 50%",
        "--neon": "0 75% 50%",
        "--neon-purple": "340 70% 55%",
        "--accent": "340 70% 55%",
        "--background": "0 20% 6%",
      },
    },
  },
  {
    id: "theme_hacker",
    name: "Hacker Terminal",
    emoji: "💻",
    price: 20000,
    proOnly: false,
    description: "Classic green-on-black terminal vibes",
    vars: {
      light: {
        "--primary": "120 80% 35%",
        "--ring": "120 80% 35%",
        "--neon": "120 80% 35%",
        "--neon-purple": "120 60% 50%",
        "--accent": "120 60% 50%",
        "--neon-amber": "120 50% 45%",
      },
      dark: {
        "--primary": "120 80% 40%",
        "--ring": "120 80% 40%",
        "--neon": "120 80% 40%",
        "--neon-purple": "120 60% 55%",
        "--accent": "120 60% 55%",
        "--neon-amber": "120 50% 50%",
        "--background": "120 10% 4%",
      },
    },
  },
  {
    id: "theme_sakura",
    name: "Sakura Bloom",
    emoji: "🌸",
    price: 12000,
    proOnly: false,
    description: "Soft pink petals and cherry blossom vibes",
    vars: {
      light: {
        "--primary": "330 65% 60%",
        "--ring": "330 65% 60%",
        "--neon": "330 65% 60%",
        "--neon-purple": "300 50% 65%",
        "--accent": "300 50% 65%",
      },
      dark: {
        "--primary": "330 65% 65%",
        "--ring": "330 65% 65%",
        "--neon": "330 65% 65%",
        "--neon-purple": "300 50% 68%",
        "--accent": "300 50% 68%",
        "--background": "330 15% 7%",
      },
    },
  },
  {
    id: "theme_toxic",
    name: "Toxic Waste",
    emoji: "☢️",
    price: 18000,
    proOnly: true,
    description: "Radioactive green with hazardous yellow",
    vars: {
      light: {
        "--primary": "85 90% 40%",
        "--ring": "85 90% 40%",
        "--neon": "85 90% 40%",
        "--neon-purple": "60 90% 50%",
        "--accent": "60 90% 50%",
        "--neon-amber": "60 90% 50%",
      },
      dark: {
        "--primary": "85 90% 45%",
        "--ring": "85 90% 45%",
        "--neon": "85 90% 45%",
        "--neon-purple": "60 90% 55%",
        "--accent": "60 90% 55%",
        "--neon-amber": "60 90% 55%",
        "--background": "85 15% 5%",
      },
    },
  },
  {
    id: "theme_galaxy",
    name: "Galaxy Nebula",
    emoji: "🌌",
    price: 25000,
    proOnly: true,
    description: "Deep space purples with stellar dust",
    vars: {
      light: {
        "--primary": "280 80% 55%",
        "--ring": "280 80% 55%",
        "--neon": "280 80% 55%",
        "--neon-purple": "220 80% 60%",
        "--accent": "220 80% 60%",
        "--neon-amber": "300 70% 60%",
      },
      dark: {
        "--primary": "280 80% 60%",
        "--ring": "280 80% 60%",
        "--neon": "280 80% 60%",
        "--neon-purple": "220 80% 65%",
        "--accent": "220 80% 65%",
        "--neon-amber": "300 70% 65%",
        "--background": "270 25% 5%",
      },
    },
  },
  {
    id: "theme_golden_hour",
    name: "Golden Hour",
    emoji: "🌤️",
    price: 20000,
    proOnly: true,
    description: "Warm golden light with amber tones",
    vars: {
      light: {
        "--primary": "40 90% 50%",
        "--ring": "40 90% 50%",
        "--neon": "40 90% 50%",
        "--neon-purple": "30 85% 55%",
        "--accent": "30 85% 55%",
        "--neon-amber": "45 95% 55%",
      },
      dark: {
        "--primary": "40 90% 55%",
        "--ring": "40 90% 55%",
        "--neon": "40 90% 55%",
        "--neon-purple": "30 85% 58%",
        "--accent": "30 85% 58%",
        "--neon-amber": "45 95% 58%",
        "--background": "35 20% 6%",
      },
    },
  },
];

interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeId: string) => void;
  ownedThemes: Set<string>;
  refreshOwned: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "theme_default",
  setTheme: () => {},
  ownedThemes: new Set(["theme_default"]),
  refreshOwned: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

function applyThemeVars(themeId: string) {
  const theme = APP_THEMES.find((t) => t.id === themeId);
  const root = document.documentElement;

  // Remove all custom theme vars first
  const allVarKeys = new Set<string>();
  APP_THEMES.forEach((t) => {
    Object.keys(t.vars.light).forEach((k) => allVarKeys.add(k));
    Object.keys(t.vars.dark).forEach((k) => allVarKeys.add(k));
  });
  allVarKeys.forEach((k) => root.style.removeProperty(k));

  if (!theme || themeId === "theme_default") return;

  // Detect dark mode
  const isDark = root.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const vars = isDark ? theme.vars.dark : theme.vars.light;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState(() =>
    localStorage.getItem("app_theme") || "theme_default"
  );
  const [ownedThemes, setOwnedThemes] = useState<Set<string>>(new Set(["theme_default"]));

  const refreshOwned = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_inventory")
      .select("item_id")
      .eq("user_id", user.id)
      .eq("item_type", "theme");
    const ids = new Set(["theme_default", ...(data?.map((d) => d.item_id) ?? [])]);
    setOwnedThemes(ids);
  };

  useEffect(() => {
    if (user) refreshOwned();
  }, [user?.id]);

  useEffect(() => {
    applyThemeVars(currentTheme);
  }, [currentTheme]);

  // Listen for dark mode changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeVars(currentTheme);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("app_theme", themeId);
    applyThemeVars(themeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, ownedThemes, refreshOwned }}>
      {children}
    </ThemeContext.Provider>
  );
}
