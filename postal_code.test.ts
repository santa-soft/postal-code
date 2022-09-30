import { assertNotEquals } from "https://deno.land/std@0.157.0/testing/asserts.ts";
import { postalCode } from "./postal_code.ts";

Deno.test("No or blank country code argument will failed", () => {
  const post = postalCode({ iso: "TH" });
  assertNotEquals(post, null);
});
