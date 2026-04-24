"use client";

import { Input } from "@/components/ui/input";

type SeminarPhoneInputProps = {
  id?: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
};

export function SeminarPhoneInput({
  id,
  name,
  required,
  defaultValue,
}: SeminarPhoneInputProps) {
  return (
    <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      <span className="shrink-0 text-sm text-muted-foreground">+91</span>
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="98765 43210"
        defaultValue={defaultValue}
        required={required}
        className="h-auto flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
