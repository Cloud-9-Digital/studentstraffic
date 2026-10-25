/** API explicitly disables annual units for reported semester/combined/full-course fee quotes. */
export function hasAnnualFeeSuffix(program: { feeIsAnnual?: boolean }, amount: string) {
  return program.feeIsAnnual !== false && /\d/.test(amount);
}
