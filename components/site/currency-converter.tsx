"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

function formatDisplay(value: number, currency: string): string {
  if (currency === "VND" || currency === "KGS") {
    return Math.round(value).toLocaleString("en-IN");
  }
  return value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseInput(val: string): number {
  // strip commas
  return parseFloat(val.replace(/,/g, "")) || 0;
}

export function CurrencyConverter({
  rate,
  localCurrency,
  date,
}: {
  rate: number;       // 1 INR = rate localCurrency
  localCurrency: string;
  date: string;
}) {
  const [inrValue, setInrValue] = useState("100,000");
  const [localValue, setLocalValue] = useState(() =>
    formatDisplay(100_000 * rate, localCurrency)
  );

  function onInrChange(raw: string) {
    setInrValue(raw);
    const n = parseInput(raw);
    setLocalValue(n > 0 ? formatDisplay(n * rate, localCurrency) : "");
  }

  function onLocalChange(raw: string) {
    setLocalValue(raw);
    const n = parseInput(raw);
    setInrValue(n > 0 ? formatDisplay(n / rate, "INR") : "");
  }

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Currency Converter
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            INR ↔ {localCurrency}
          </p>
        </div>
        <span className="text-[0.65rem] text-muted-foreground text-right leading-5">
          Last updated<br />{formattedDate}
        </span>
      </div>

      {/* Rate summary */}
      <div className="mb-4 rounded-xl bg-[#f7f5f0] px-4 py-3 flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">1 INR</span>
        <span className="text-xs text-muted-foreground">=</span>
        <span className="text-sm font-semibold text-foreground">
          {formatDisplay(rate, localCurrency)} {localCurrency}
        </span>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <ConverterInput
          label="INR"
          value={inrValue}
          onChange={onInrChange}
          currencyCode="INR"
        />

        <div className="flex justify-center">
          <div className="rounded-full border border-border/60 bg-[#f7f5f0] p-1.5">
            <ArrowLeftRight className="size-3 text-muted-foreground" />
          </div>
        </div>

        <ConverterInput
          label={localCurrency}
          value={localValue}
          onChange={onLocalChange}
          currencyCode={localCurrency}
        />
      </div>

      <p className="mt-4 text-[0.65rem] leading-5 text-muted-foreground">
        Indicative rate, updated daily. Use for planning only — verify with your bank before transferring funds.
      </p>
    </div>
  );
}

function ConverterInput({
  label,
  value,
  onChange,
  currencyCode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  currencyCode: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-[#faf8f4] px-4 py-3 focus-within:border-border focus-within:bg-white transition-colors">
      <CurrencyFlag code={currencyCode} />
      <span className="text-xs font-semibold text-muted-foreground w-8 shrink-0">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-right text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
        placeholder="0"
      />
    </div>
  );
}

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  RUB: "ru",
  VND: "vn",
  GEL: "ge",
  KGS: "kg",
  USD: "us",
  EUR: "eu",
  INR: "in",
};

function CurrencyFlag({ code }: { code: string }) {
  const countryCode = CURRENCY_TO_COUNTRY[code];
  if (!countryCode) return <span className="size-5 rounded-sm bg-muted" />;
  return (
    <span className="relative inline-block size-5 shrink-0 overflow-hidden rounded-sm">
      <Image
        src={`https://flagcdn.com/w40/${countryCode}.png`}
        alt={code}
        fill
        sizes="20px"
        className="object-cover"
      />
    </span>
  );
}
