"use client";

import { createContext, useContext } from "react";

import type { NavCountry } from "@/lib/data/nav-countries";

const NavCountriesContext = createContext<NavCountry[]>([]);

export function NavCountriesClientProvider({
  countries,
  children,
}: {
  countries: NavCountry[];
  children: React.ReactNode;
}) {
  return (
    <NavCountriesContext.Provider value={countries}>
      {children}
    </NavCountriesContext.Provider>
  );
}

export function useNavCountries(): NavCountry[] {
  return useContext(NavCountriesContext);
}
