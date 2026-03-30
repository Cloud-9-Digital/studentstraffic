"use client";

import { forwardRef, useState } from "react";
import PhoneInput, {
  type Country,
  isValidPhoneNumber,
  type Value,
} from "react-phone-number-input";

import { cn } from "@/lib/utils";

interface PhoneInputFieldProps {
  id?: string;
  name: string;
  required?: boolean;
  defaultCountry?: Country;
  defaultValue?: string;
  className?: string;
}

// Bare input rendered inside the wrapper — no own border
const InnerInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function InnerInput({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

export function PhoneInputField({
  id,
  name,
  required,
  defaultCountry = "IN",
  defaultValue,
  className,
}: PhoneInputFieldProps) {
  const [value, setValue] = useState<Value | undefined>(
    (defaultValue as Value) ?? undefined
  );
  const [touched, setTouched] = useState(false);
  const isInvalid = touched && value !== undefined && value !== "" && !isValidPhoneNumber(value);

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-xl border bg-transparent px-4 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none",
          "border-border focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          isInvalid && "border-destructive ring-[3px] ring-destructive/20",
          className,
        )}
      >
        <PhoneInput
          id={id}
          international
          countryCallingCodeEditable={false}
          defaultCountry={defaultCountry}
          value={value}
          onChange={setValue}
          onBlur={() => setTouched(true)}
          inputComponent={InnerInput}
          className="flex w-full items-center"
          numberInputProps={{
            placeholder: "98765 43210",
          }}
        />
      </div>
      {/* Hidden input carries the E.164 value into FormData */}
      <input
        type="hidden"
        name={name}
        value={value ?? ""}
        required={required}
      />
      {isInvalid && (
        <p className="text-xs text-destructive">
          Please enter a valid phone number.
        </p>
      )}
    </div>
  );
}
