import { CountryOptions } from "./types.ts";

export const postalCode = (country: string | number | CountryOptions) => {
  return {
    country: country,
  };
};
