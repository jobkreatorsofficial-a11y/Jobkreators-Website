"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = { value: string; label: string };

/**
 * FilterDropdown — a compact multi-select popover (button + checklist). Closes on
 * outside-click and Escape. Selection is a controlled string[] owned by the parent
 * (which mirrors it into the URL).
 */
export default function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly Option[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (value: string) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  const count = selected.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-body-sm font-medium transition-colors ${
          count > 0
            ? "border-accent bg-accent/5 text-text"
            : "border-border-strong bg-surface text-text-muted hover:border-accent hover:text-text"
        }`}
      >
        {label}
        {count > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-fg">
            {count}
          </span>
        )}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 max-h-72 w-60 overflow-auto rounded-xl border border-border bg-surface p-1.5 shadow-[var(--shadow-lg)]">
          {options.map((opt) => {
            const active = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-body-sm text-text transition-colors hover:bg-surface-2"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    active ? "border-accent bg-accent text-accent-fg" : "border-border-strong"
                  }`}
                  aria-hidden
                >
                  {active && <Check size={12} strokeWidth={3} />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
