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

/**
 * PostalCodeOptions
 *
 * An object to describe which addresses data should be used.
 * The default configuration is:
 *
 * ```ts
 * {
 *   country: "th",
 *   resourceUrl: "https://raw.githubusercontent.com/santa-soft/postal-code/main/.local/th/postal_codes.json",
 *   cachePath: "./.local/th/postal_codes.json",
 *   lang: "en"
 * }
 * ```
 */
export interface PostalCodeOptions {
  /**
   * Configure address of which country
   *
   * ### *** Only support Thailand for now.
   */
  country?: string;
  /**
   * Configure url of json data file which contains addresses and zip code.
   */
  resourceUrl?: string;
  /**
   * Configure local path when load json data of addresses from `resourceUrl`.
   */
  cachePath?: string;
  /**
   * Configure of output data when you query with `.addressOf()` function.
   */
  lang?: string;
}
