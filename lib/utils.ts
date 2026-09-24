import dayjs from "dayjs";

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

// Field-specific Clerk errors (e.g. password rules) are surfaced via `errors.fields`, so skip them at the form level.
export const isClerkFieldError = (error: unknown): boolean => {
  const clerkError = error as { errors?: { meta?: { paramName?: string } }[] } | null;
  return Boolean(clerkError?.errors?.[0]?.meta?.paramName);
};

export const getClerkErrorMessage = (error: unknown): string => {
  const clerkError = error as { errors?: { longMessage?: string; message?: string }[]; message?: string } | null;
  return (
    clerkError?.errors?.[0]?.longMessage ??
    clerkError?.errors?.[0]?.message ??
    clerkError?.message ??
    "Something went wrong. Please try again."
  );
};