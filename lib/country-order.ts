const TOP_COUNTRIES = ["Vietnam", "Russia"] as const;

function getPriorityIndex(country: string) {
  const normalized = country.trim().toLowerCase();
  const index = TOP_COUNTRIES.findIndex(
    (item) => item.toLowerCase() === normalized
  );
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

export function sortCountryNames<T extends string>(countries: T[]) {
  return [...countries].sort((left, right) => {
    const leftPriority = getPriorityIndex(left);
    const rightPriority = getPriorityIndex(right);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.localeCompare(right);
  });
}

export function sortCountryOptionObjects<T extends { name: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftPriority = getPriorityIndex(left.name);
    const rightPriority = getPriorityIndex(right.name);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.name.localeCompare(right.name);
  });
}

export function sortCountryLabelObjects<T extends { country: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftPriority = getPriorityIndex(left.country);
    const rightPriority = getPriorityIndex(right.country);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.country.localeCompare(right.country);
  });
}
