import {
  afterEach,
  assertEquals,
  assertFalse,
  assertNotMatch,
  assertRejects,
  assertThrows,
  describe,
  fail,
  it,
} from "./dev_deps.ts";
import { createPostalCode, PostalCode } from "./postal_code.ts";

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

describe(`createPostalCode()`, () => {
  const testJsonPath = "./.test/th/postal_codes.json";
  const testResourceUrl =
    "https://raw.githubusercontent.com/santa-soft/postal-code/main/.local/th/postal_codes.json";
  it(`resource file 'postal_codes.json' initially non-existed`, () => {
    assertRejects(() => Deno.lstat(testJsonPath), Deno.errors.NotFound);
  });

  describe(`resource file 'postal_codes.json' be loaded when initialize`, () => {
    afterEach(async () => await cleanup(testJsonPath));

    it(`initial with 'th':string is OK`, async () => {
      const actualPostString = await createPostalCode("th", {
        resourceUrl: testResourceUrl,
        cachePath: testJsonPath,
      });
      assertEquals(actualPostString.constructor.name, "PostalCode");
      assertEquals(actualPostString.options.country, "th");
      assertEquals(actualPostString.options.resourceUrl, testResourceUrl);
      assertEquals(actualPostString.options.cachePath, testJsonPath);
      try {
        const testFileInfo = Deno.lstatSync(testJsonPath);
        assertFalse(testFileInfo.size <= 0);
      } catch (_) {
        // shouldn't come here
        fail();
      }
    });
    it(`initial with 66:number is OK`, async () => {
      const actualPostNumber = await createPostalCode(66, {
        cachePath: testJsonPath,
      });
      assertEquals(actualPostNumber.constructor.name, "PostalCode");
      assertEquals(actualPostNumber.options.country, "th");
      assertEquals(actualPostNumber.options.resourceUrl, testResourceUrl);
      assertEquals(actualPostNumber.options.cachePath, testJsonPath);
      try {
        const testFileInfo = Deno.lstatSync(testJsonPath);
        assertFalse(testFileInfo.size <= 0);
      } catch (_) {
        // shouldn't come here
        fail();
      }
    });
  });
});

describe(`PostalCode`, () => {
  afterEach(async () => await cleanup(testJsonPath));

  const testJsonPath = "./.test/th/postal_codes.json";

  const postalCode = new PostalCode({
    country: "th",
    cachePath: "./.test/th/test_codes.json",
    lang: "th",
  });

  it(`addressOf(xxxxx) get address`, () => {
    const address = postalCode.addressOf(10270);
    assertFalse(!Array.isArray(address));
    assertFalse(address?.length === 0);
    assertNotMatch(address?.at(0)?.province as string, /[A-Za-z]/);
    assertNotMatch(address?.at(0)?.district as string, /[A-Za-z]/);
    assertNotMatch(address?.at(0)?.subDistrict as string, /[A-Za-z]/);
  });

  it(`addressOf() will error when passed string contains non-numeric character`, () => {
    assertThrows(() => {
      postalCode.addressOf("101SO");
    }, Deno.errors.NotSupported);
  });
});

const cleanup = async (filePath: string) => {
  try {
    await Deno.remove(filePath);
  } catch (_) {
    console.error("test file deletion error");
  }
};
