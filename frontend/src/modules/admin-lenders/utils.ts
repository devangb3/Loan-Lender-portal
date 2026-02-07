export function rangeLabel(minLoan: number, maxLoan: number): string {
  return `${minLoan.toLocaleString()} - ${maxLoan.toLocaleString()}`;
}
