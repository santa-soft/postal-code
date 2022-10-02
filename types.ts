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
  province: ThaiPostalOption;
  district: ThaiPostalOption;
  subDistrict: ThaiPostalOption;
  region?: string;
}

export interface AddressAnwser {
  code: number;
  province: string;
  district: string;
  subDistrict: string;
  region?: string;
}

export interface PostalCodeOptions {
  country?: string;
  resourceUrl?: string;
  cachePath?: string;
  lang?: string;
}
