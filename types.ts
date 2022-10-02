export type CountryOptions = {
  name?: string;
  code?: string | number;
  iso?: string;
};

export interface ThaiPostalOption {
  en: string;
  th: string;
}

export interface PostalAddress {
  code: number;
  province: string | ThaiPostalOption;
  district: string | ThaiPostalOption;
  subDistrict: string | ThaiPostalOption;
  region?: string;
}

export interface PostalCodeOptions {
  country?: string;
  resourceUrl?: string;
  cachePath?: string;
}
