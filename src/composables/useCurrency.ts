// frontend/src/composables/useCurrency.ts
import { ref } from "vue";

const currencies = {
  EUR: { symbol: "€", rate: 1 },
  USD: { symbol: "$", rate: 1.08 },
  MGA: { symbol: "Ar", rate: 4500 },
};

export function useCurrency() {
  const currentCurrency = ref("EUR");

  const formatCurrency = (amount: number | string | null | undefined): string => {
    // Conversion robuste en nombre
    const numericAmount =
      typeof amount === "number" ? amount : parseFloat(String(amount).replace(",", "."));
    if (isNaN(numericAmount)) {
      return "0.00 €";
    }
    const currency = currencies[currentCurrency.value as keyof typeof currencies];
    return `${currency.symbol} ${numericAmount.toFixed(2)}`;
  };

  const convert = (amount: number, from: string, to: string): number => {
    const fromRate = currencies[from as keyof typeof currencies]?.rate || 1;
    const toRate = currencies[to as keyof typeof currencies]?.rate || 1;
    return amount * (toRate / fromRate);
  };

  return {
    currentCurrency,
    formatCurrency,
    convert,
  };
}
