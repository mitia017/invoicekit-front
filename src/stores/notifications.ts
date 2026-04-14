import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types";

export const useNotificationStore = defineStore("notifications", () => {
  const toast = useToast();

  /**
   * SUCCESS
   */
  const success = (message: string, duration = 3000) => {
    toast.success(message, { duration });
  };

  /**
   * ERROR
   */
  const error = (message: string, duration = 5000) => {
    toast.error(message, { duration });
  };

  /**
   * DANGER (for critical actions like delete)
   */
  const danger = (message: string, duration = 5000) => {
    toast.error(message, { duration });
  };

  /**
   * WARNING
   */
  const warning = (message: string, duration = 4000) => {
    toast.warning(message, { duration });
  };

  /**
   * INFO
   */
  const info = (message: string, duration = 3000) => {
    toast.info(message, { duration });
  };

  /**
   * HANDLE API ERROR (Axios)
   */
  const handleApiError = (
    errorData: AxiosError<ApiErrorResponse>,
    defaultMessage = "Une erreur est survenue",
  ) => {
    // Handle unauthorized (403) errors
    if (errorData?.response?.status === 403) {
      error("Vous n'avez pas la permission d'effectuer cette action.");
      if (import.meta.env.DEV) {
        console.error("API Error (403):", errorData);
      }
      return;
    }

    const message = errorData?.response?.data?.message || errorData?.message || defaultMessage;

    if (import.meta.env.DEV) {
      console.error("API Error:", errorData);
    }

    error(message);
  };

  /**
   * HANDLE VALIDATION ERRORS (Laravel style)
   */
  const handleValidationErrors = (errors: Record<string, string[]>) => {
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach((msg) => {
        warning(`${field}: ${msg}`);
      });
    });
  };

  return {
    success,
    error,
    danger,
    warning,
    info,
    handleApiError,
    handleValidationErrors,
  };
});
