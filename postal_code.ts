import { PostalAddress, PostalCodeOptions, AddressAnwser } from "./types.ts";
import { copy, dirname, ensureDir, readerFromStreamReader } from "./deps.ts";

export class PostalCode {
  public options: PostalCodeOptions;
  private address: Array<PostalAddress>;

  constructor(private prop: PostalCodeOptions) {
    this.options = prop;
    this.address = JSON.parse(Deno.readTextFileSync(prop.cachePath!)) as Array<PostalAddress>;
  }

  public addressOf = (zip: number | string): Array<AddressAnwser> | null => {
    if(typeof zip === "string" && !zip.match(/^[0-9]{5}$/)) {
      throw new Deno.errors.NotSupported();
    }
    zip = (typeof zip === "string") ? parseInt(zip) : zip;
    const lang = this.options.lang || "en";
    
    return this.address.filter(addr => addr.code === zip)
      .map(addr => {
        return {
          code: addr.code,
          province: addr.province[lang as keyof typeof addr.province],
          district: addr.district[lang as keyof typeof addr.district],
          subDistrict: addr.subDistrict[lang as keyof typeof addr.subDistrict]
        } as AddressAnwser;
      });
  }
}

export const createPostalCode = async (
  country: string | number,
  options?: PostalCodeOptions,
) => {
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
