"use client";

import { createContext, useContext } from "react";

import type { NavUniversityCountryGroup } from "@/lib/data/nav-universities";

const NavUniversitiesContext = createContext<NavUniversityCountryGroup[]>([]);

export function NavUniversitiesClientProvider({
  countryGroups,
  children,
}: {
  countryGroups: NavUniversityCountryGroup[];
  children: React.ReactNode;
}) {
  return (
    <NavUniversitiesContext.Provider value={countryGroups}>
      {children}
    </NavUniversitiesContext.Provider>
  );
}

export function useNavUniversities(): NavUniversityCountryGroup[] {
  return useContext(NavUniversitiesContext);
}
