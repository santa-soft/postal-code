import { AddressAnwser, PostalAddress, PostalCodeOptions } from "./types.ts";
import { copy, dirname, ensureDir, readerFromStreamReader } from "./deps.ts";

/**
 * Class which be created when loads addresses data from json file.
 *
 * @constructure PostalCode({PostalCodeOptions}) - if `createPostalCode()` function pass only country code,
 * it will create `PostalCode` object with default options.
 */
export class PostalCode {
  public options: PostalCodeOptions;
  private address: Array<PostalAddress>;

  constructor(private prop: PostalCodeOptions) {
    this.options = prop;
    this.address = JSON.parse(Deno.readTextFileSync(prop.cachePath!)) as Array<PostalAddress>;
  }

  public addressOf = (zip: number | string): Array<AddressAnwser> | null => {
    if (typeof zip === "string" && zip.match(/[A-Za-z\s]*/)) {
      throw new Deno.errors.NotSupported();
    }
    zip = (typeof zip === "string") ? parseInt(zip) : zip;
    const lang = this.options.lang || "en";

    return this.address.filter((addr) => addr.code === zip)
      .map((addr) => {
        return {
          code: addr.code,
          province: addr.province[lang as keyof typeof addr.province],
          district: addr.district[lang as keyof typeof addr.district],
          subDistrict: addr.subDistrict[lang as keyof typeof addr.subDistrict],
        } as AddressAnwser;
      });
  };
}

/**
 * createPostalCode<Promise> create object of loaded addresses data
 * @param {string | number} country country code as number or ISO code e.g. 66 or TH
 * @param { PostalCodeOptions } options optional, if you want to change mechanic of loaded address
 * @return { Promise<PostalCode> } object contains with loaded addresses
 */
export const createPostalCode = async (
  country: string | number,
  options?: PostalCodeOptions,
): Promise<PostalCode> => {
  if (
    !country ||
    (typeof country === "string" && country.toLocaleLowerCase() !== "th") ||
    (typeof country === "number" && country !== 66)
  ) {
    throw new Deno.errors.NotSupported("Not Supported the Options!");
  }

  const countryCode = (typeof country === "number" && country === 66) ? "th" : country;

  const defaultOptions = {
    country: countryCode,
    resourceUrl:
      "https://raw.githubusercontent.com/santa-soft/postal-code/main/.local/th/postal_codes.json",
    cachePath: `./.local/${countryCode}/postal_codes.json`,
  };
  const postalCodeOptions = {
    ...defaultOptions,
    ...options,
  };

  if (!await isResourceExist(postalCodeOptions.cachePath)) {
    // check directory of cache file, create if not exist
    await ensureDir(dirname(postalCodeOptions.cachePath));
    const response = await fetch(postalCodeOptions.resourceUrl);
    const reader = response.body?.getReader();
    if (reader) {
      const dReader = readerFromStreamReader(reader);
      const file = await Deno.open(postalCodeOptions.cachePath, {
        create: true,
        write: true,
      });
      await copy(dReader, file);
      file.close();
    }
  }

  return new PostalCode(postalCodeOptions);
};

const isResourceExist = async (jsonPath: string) => {
  try {
    await Deno.lstat(jsonPath);
  } catch (_) {
    console.error("check file existing error");
    return false;
  }
  return true;
};
