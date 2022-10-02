import { afterEach, assertEquals, assertRejects, describe, it } from "./dev_deps.ts";
import { createPostalCode } from "./postal_code.ts";

Deno.test(`blank or mismatched country code argument will failed`, () => {
  assertRejects(
    async () => {
      await createPostalCode("");
    },
    Deno.errors.NotSupported,
    "Not Supported the Options!",
  );

  assertRejects(
    async () => {
      await createPostalCode(1);
    },
    Deno.errors.NotSupported,
    "Not Supported the Options!",
  );

  assertRejects(
    async () => {
      await createPostalCode("US");
    },
    Deno.errors.NotSupported,
    "Not Supported the Options!",
  );
});

describe(`postalCode()`, () => {
  const testJsonPath = "./.test/th/postal_codes.json";
  const testResourceUrl = "https://raw.githubusercontent.com/santa-soft/postal-code/main/.local/th/postal_codes.json";
  it(`resource file 'postal_codes.json' initially non-existed`, () => {
    assertRejects(() => Deno.lstat(testJsonPath), Deno.errors.NotFound);
  });

  describe(`resource file 'postal_codes.json' be loaded when initialize`, () => {
    afterEach(async () => {
      try {
        await Deno.remove(testJsonPath);
      } catch (_) {
        console.error("test file deletion error");
      }
    });

    it(`initial with 'th':string is OK`, async () => {
      const actualPostString = await createPostalCode("th", { resourceUrl: testResourceUrl, cachePath: testJsonPath });
      assertEquals(actualPostString.constructor.name, "PostalCode");
      assertEquals(actualPostString.options.country, "th");
      assertEquals(actualPostString.options.resourceUrl, testResourceUrl);
      assertEquals(actualPostString.options.cachePath, testJsonPath);
    });
    it(`initial with 66:number is OK`, async () => {
      const actualPostNumber = await createPostalCode(66, { cachePath: testJsonPath });
      assertEquals(actualPostNumber.constructor.name, "PostalCode");
      assertEquals(actualPostNumber.options.country, "th");
      assertEquals(actualPostNumber.options.resourceUrl, testResourceUrl);
      assertEquals(actualPostNumber.options.cachePath, testJsonPath);
    });
  });
});
