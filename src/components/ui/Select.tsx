import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/cn";
import { BottomSheet } from "./BottomSheet";
import { FIELD_SIZE_CLASSES, FieldLabel, FieldMessage, fieldStateClasses } from "./Input";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export type SelectSize = "sm" | "md" | "lg" | "parent";

export interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  className?: string;
  id?: string;
  onChange: (value: string) => void;
  /** Nhãn cho trình đọc màn hình khi không có label hiển thị */
  ariaLabel?: string;
}

const MOBILE_QUERY = "(max-width: 767.98px)";

function useIsBelowMd(): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return matches;
}

/** Bỏ dấu tiếng Việt để tìm theo chữ cái đầu (typeahead). */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
}

/**
 * Select (03 §4.3)
 * - Desktop (>= md): dropdown nổi, hỗ trợ bàn phím (mũi tên, Home/End, Enter/Space, Esc, gõ chữ cái đầu).
 * - Mobile (< md): mở BottomSheet danh sách lựa chọn lớn (>= 3.5rem mỗi dòng).
 */
export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  placeholder = "Chọn một mục…",
  disabled = false,
  required = false,
  error,
  helperText,
  size = "md",
  className = "",
  id,
  onChange,
  ariaLabel,
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;
  const labelId = `${selectId}-label`;
  const valueId = `${selectId}-value`;
  const listboxId = `${selectId}-listbox`;
  const optionId = (index: number) => `${selectId}-option-${index}`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isMobile = useIsBelowMd();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef<{ text: string; timer: number | undefined }>({ text: "", timer: undefined });

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const hasError = Boolean(error);
  const desktopOpen = isOpen && !isMobile;

  const firstEnabled = () => options.findIndex((opt) => !opt.disabled);
  const lastEnabled = () => {
    for (let i = options.length - 1; i >= 0; i--) if (!options[i].disabled) return i;
    return -1;
  };
  const step = (from: number, delta: 1 | -1) => {
    for (let i = from + delta; i >= 0 && i < options.length; i += delta) {
      if (!options[i].disabled) return i;
    }
    return from;
  };

  // Đóng dropdown desktop khi bấm ra ngoài
  useEffect(() => {
    if (!desktopOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [desktopOpen]);

  // Giữ mục đang active trong vùng nhìn thấy
  useEffect(() => {
    if (!desktopOpen || activeIndex < 0) return;
    document.getElementById(`${selectId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [desktopOpen, activeIndex, selectId]);

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  const openMenu = (preferredIndex?: number) => {
    if (disabled) return;
    setActiveIndex(preferredIndex ?? (selectedIndex >= 0 ? selectedIndex : firstEnabled()));
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    closeMenu();
  };

  const findByTypeahead = (key: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.text += normalize(key);
    state.timer = window.setTimeout(() => {
      state.text = "";
    }, 600);

    const query = state.text;
    const repeated = query.length > 1 && query.split("").every((ch) => ch === query[0]);
    const needle = repeated ? query[0] : query;
    const start = repeated || query.length === 1 ? activeIndex + 1 : Math.max(activeIndex, 0);

    for (let n = 0; n < options.length; n++) {
      const index = (start + n) % options.length;
      const opt = options[index];
      if (!opt.disabled && normalize(opt.label).startsWith(needle)) return index;
    }
    return -1;
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (isMobile) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) openMenu();
        else setActiveIndex((i) => step(i < 0 ? -1 : i, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) openMenu();
        else setActiveIndex((i) => step(i < 0 ? options.length : i, -1));
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(firstEnabled());
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(lastEnabled());
        }
        break;
      case "Enter":
      case " ":
        if (isOpen) {
          event.preventDefault();
          const opt = options[activeIndex];
          if (opt && !opt.disabled) handleSelect(opt.value);
          else closeMenu();
        }
        break;
      case "Escape":
        if (isOpen) {
          // Không để Esc đóng luôn Modal/BottomSheet bên ngoài
          event.preventDefault();
          event.stopPropagation();
          closeMenu();
        }
        break;
      case "Tab":
        if (isOpen) setIsOpen(false);
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const match = findByTypeahead(event.key);
          if (match >= 0) {
            if (!isOpen) openMenu(match);
            else setActiveIndex(match);
          }
        }
    }
  };

  const labelledBy = label ? `${labelId} ${valueId}` : undefined;

  return (
    <div ref={containerRef} className={cn("flex w-full flex-col", className)}>
      {label && (
        <FieldLabel htmlFor={selectId} id={labelId} size={size} required={required}>
          {label}
        </FieldLabel>
      )}

      <div className="relative w-full">
        {/* Trigger */}
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={desktopOpen ? listboxId : undefined}
          aria-activedescendant={desktopOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-labelledby={labelledBy}
          aria-label={label ? undefined : ariaLabel || placeholder}
          aria-required={required || undefined}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          onClick={() => (isOpen ? closeMenu() : openMenu())}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex w-full items-center justify-between rounded-control border text-left outline-none select-none",
            "transition-[border-color,box-shadow,background-color] duration-150",
            FIELD_SIZE_CLASSES[size],
            fieldStateClasses({ hasError, disabled }),
            !disabled && "cursor-pointer",
            isOpen && !hasError && "border-primary ring-4 ring-primary/15"
          )}
        >
          <span id={valueId} className={cn("min-w-0 truncate", selectedOption ? "text-ink" : "text-ink-3")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "shrink-0 transition-transform duration-200 ease-out-soft",
              isOpen ? "rotate-180 text-primary" : "text-ink-3"
            )}
            aria-hidden="true"
          />
        </button>

        {/* Desktop: dropdown */}
        {desktopOpen && (
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : ariaLabel || placeholder}
            tabIndex={-1}
            className="absolute inset-x-0 top-full z-(--z-overlay) mt-1.5 max-h-72 overflow-y-auto overscroll-contain rounded-control border border-line bg-surface p-1.5 shadow-float"
          >
            {options.length === 0 ? (
              <li className="px-3 py-3 text-center text-sm text-ink-3">Không có lựa chọn nào</li>
            ) : (
              options.map((opt, index) => {
                const isSelected = opt.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={opt.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled || undefined}
                    onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    className={cn(
                      "flex min-h-11 items-center justify-between gap-3 rounded-sm px-3 py-2 text-base transition-colors duration-100",
                      isActive && !opt.disabled && "bg-surface-2",
                      isSelected ? "font-semibold text-primary-ink" : "text-ink",
                      opt.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{opt.label}</span>
                      {opt.description && (
                        <span className="text-sm font-normal text-ink-3">{opt.description}</span>
                      )}
                    </span>
                    {isSelected && <Check className="size-4 shrink-0" aria-hidden="true" />}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      <FieldMessage id={hasError ? errorId : helperId} error={error} helperText={helperText} size={size} />

      {/* Mobile: BottomSheet danh sách lớn */}
      {isMobile && (
        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={label || placeholder}>
          {options.length === 0 ? (
            <p className="py-6 text-center text-base text-ink-3">Không có lựa chọn nào</p>
          ) : (
            <div role="listbox" aria-label={label || ariaLabel || placeholder} className="-mx-2 space-y-1 pb-2">
              {options.map((opt, index) => {
                const isSelected = opt.value === value;
                const autoFocus = selectedIndex >= 0 ? isSelected : index === firstEnabled();
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    data-autofocus={autoFocus ? "" : undefined}
                    onClick={() => !opt.disabled && handleSelect(opt.value)}
                    className={cn(
                      "flex min-h-14 w-full items-center justify-between gap-3 rounded-control px-4 py-3 text-left text-base",
                      "transition-colors duration-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-primary/50",
                      isSelected
                        ? "bg-primary-soft font-semibold text-primary-ink"
                        : "text-ink hover:bg-surface-2 active:bg-surface-3",
                      opt.disabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="leading-snug">{opt.label}</span>
                      {opt.description && (
                        <span className="mt-0.5 text-sm font-normal text-ink-3">{opt.description}</span>
                      )}
                    </span>
                    {isSelected ? (
                      <Check className="size-5 shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="size-5 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </BottomSheet>
      )}
    </div>
  );
};
