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
          "flex h-11 w-full items-center rounded-xl border bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none",
          "border-border focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          isInvalid && "border-destructive ring-[3px] ring-destructive/20",
          className,
          "[&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1.5 [&_.PhoneInputCountry]:pl-3 [&_.PhoneInputCountry]:pr-3 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-border [&_.PhoneInputCountry]:mr-3",
          "[&_.PhoneInputCountrySelectArrow]:text-muted-foreground [&_.PhoneInputCountrySelectArrow]:opacity-70 [&_.PhoneInputCountrySelectArrow]:ml-0.5",
          "[&_.PhoneInputCountryFlag]:overflow-hidden [&_.PhoneInputCountryFlag]:rounded-sm",
          "[&_.PhoneInputCountryIcon]:size-5 [&_.PhoneInputCountryIcon]:shrink-0",
          "[&_.PhoneInputCountryIconInternational]:size-5 [&_.PhoneInputCountryIconInternational]:text-muted-foreground",
        )}
      >
        <PhoneInput
          id={id}
          international
          countryCallingCodeEditable={true}
          defaultCountry={defaultCountry}
          value={value}
          onChange={setValue}
          onBlur={() => setTouched(true)}
          inputComponent={InnerInput}
          className="flex w-full items-center pr-3"
          numberInputProps={{
            placeholder: "Phone number",
          }}
        />
      </div>
      <input type="hidden" name={name} value={value ?? ""} required={required} />
      {isInvalid && (
        <p className="text-xs text-destructive">Please enter a valid phone number.</p>
      )}
    </div>
  );
}
