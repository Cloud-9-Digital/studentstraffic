const mobileBottomNavigationRoots = ["/universities", "/countries", "/cities", "/courses"];

/**
 * Discovery routes benefit from persistent wayfinding. Detail and conversion
 * routes keep their focused counselling CTA instead.
 */
export function usesMobileBottomNavigation(pathname: string) {
  return pathname === "/" || mobileBottomNavigationRoots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}
