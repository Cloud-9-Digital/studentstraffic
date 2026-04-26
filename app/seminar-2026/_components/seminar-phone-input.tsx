"use client";

import { type Country } from "react-phone-number-input";

import { PhoneInputField } from "@/components/ui/phone-input";

type SeminarPhoneInputProps = {
  id?: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  defaultCountry?: Country;
};

export function SeminarPhoneInput({
  id,
  name,
  required,
  defaultValue,
  defaultCountry = "IN",
}: SeminarPhoneInputProps) {
  return (
    <PhoneInputField
      id={id}
      name={name}
      defaultCountry={defaultCountry}
      defaultValue={defaultValue}
      required={required}
    />
  );
}
