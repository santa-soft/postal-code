import { PostalCodeOptions } from "./types.ts";
import { copy, dirname, ensureDir, readerFromStreamReader } from "./deps.ts";

export class PostalCode {
  public options: PostalCodeOptions;

  constructor(private prop: PostalCodeOptions) {
    this.options = prop;
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

  const countryCode = (typeof country === "number" && country === 66)
    ? "th"
    : country;

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
