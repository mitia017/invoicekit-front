export function useVariation() {
  const format = (val: number) =>
    `${val >= 0 ? "+" : ""}${val}%`;

  const color = (val: number) =>
    val >= 0
      ? "text-green-600 dark:text-green-200"
      : "text-red-600 dark:text-red-200";

  return { format, color };
}