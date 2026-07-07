"use client";

import { createContext, useContext } from "react";

import type { NavCourse } from "@/lib/data/nav-courses";

const NavCoursesContext = createContext<NavCourse[]>([]);

export function NavCoursesClientProvider({
  courses,
  children,
}: {
  courses: NavCourse[];
  children: React.ReactNode;
}) {
  return (
    <NavCoursesContext.Provider value={courses}>
      {children}
    </NavCoursesContext.Provider>
  );
}

export function useNavCourses(): NavCourse[] {
  return useContext(NavCoursesContext);
}
