"use client";

import { createContext, useContext } from "react";

import type { NavCountry, NavCountryRegionGroup } from "@/lib/data/nav-countries";

const NavCountriesContext = createContext<NavCountry[]>([]);
const NavCountriesByRegionContext = createContext<NavCountryRegionGroup[]>([]);

export function NavCountriesClientProvider({
  countries,
  regionGroups = [],
  children,
}: {
  countries: NavCountry[];
  regionGroups?: NavCountryRegionGroup[];
  children: React.ReactNode;
}) {
  return (
    <NavCountriesContext.Provider value={countries}>
      <NavCountriesByRegionContext.Provider value={regionGroups}>
        {children}
      </NavCountriesByRegionContext.Provider>
    </NavCountriesContext.Provider>
  );
}

export function useNavCountries(): NavCountry[] {
  return useContext(NavCountriesContext);
}

export function useNavCountriesByRegion(): NavCountryRegionGroup[] {
  return useContext(NavCountriesByRegionContext);
}
