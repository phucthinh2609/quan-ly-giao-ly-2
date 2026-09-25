import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { UserRole } from "../types";

// ============================================================================
// PREFERENCES CONTEXT (03 §3.4) — Giao diện Sáng/Tối, Cỡ chữ, Chế độ demo
// Phải nằm trong <AuthProvider> vì cỡ chữ mặc định phụ thuộc vai trò.
// ============================================================================

export type ThemeMode = "light" | "dark";
export type TextSize = "md" | "lg" | "xl";

export const TEXT_SIZE_OPTIONS: { value: TextSize; label: string; hint: string }[] = [
  { value: "md", label: "Vừa", hint: "16px" },
  { value: "lg", label: "Lớn", hint: "18px" },
  { value: "xl", label: "Rất lớn", hint: "20px" },
];

const ROLE_DEFAULT_TEXT_SIZE: Record<UserRole, TextSize> = {
  ADMIN: "md",
  GLV: "md",
  PARENT: "lg",
  STUDENT: "md",
};

const STORAGE = {
  theme: "qlgl.theme",
  textSize: "qlgl.textSize",
  demoMode: "qlgl.demoMode",
};

interface PreferencesContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
  mobileFrame: boolean;
  setMobileFrame: (value: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function initialTheme(): ThemeMode {
  const saved = readStorage(STORAGE.theme);
  if (saved === "light" || saved === "dark") return saved;
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function initialTextSize(): TextSize | null {
  const saved = readStorage(STORAGE.textSize);
  return saved === "md" || saved === "lg" || saved === "xl" ? saved : null;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  // null = người dùng chưa chọn → dùng mặc định theo vai trò
  const [explicitTextSize, setExplicitTextSize] = useState<TextSize | null>(initialTextSize);
  const [demoMode, setDemoModeState] = useState<boolean>(() => readStorage(STORAGE.demoMode) === "1");
  const [mobileFrame, setMobileFrame] = useState(false);

  const textSize: TextSize = explicitTextSize ?? ROLE_DEFAULT_TEXT_SIZE[role];

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#110F0D" : "#F7F3ED");
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-text-size", textSize);
  }, [textSize]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    writeStorage(STORAGE.theme, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      writeStorage(STORAGE.theme, next);
      return next;
    });
  }, []);

  const setTextSize = useCallback((size: TextSize) => {
    setExplicitTextSize(size);
    writeStorage(STORAGE.textSize, size);
  }, []);

  const setDemoMode = useCallback((value: boolean) => {
    setDemoModeState(value);
    writeStorage(STORAGE.demoMode, value ? "1" : "0");
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      textSize,
      setTextSize,
      demoMode,
      setDemoMode,
      mobileFrame,
      setMobileFrame,
    }),
    [theme, setTheme, toggleTheme, textSize, setTextSize, demoMode, setDemoMode, mobileFrame]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
