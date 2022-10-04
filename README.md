# Postal Code API

Postal Code is Deno module for providing mapped postal zip code with addresses

# Usage

## Simple Usage

```ts
import { createPostalCode } from "https://deno.land/x/postal_code/mod.ts";

const postalCode = await createPostalCode("TH", { lang: "th" });
const bangkok01 = postalCode.addressOf(10270);

// example `bangkok01` structure
  {
    "code": 10270,
    "province": "สมุทรปราการ",
    "district": "เมืองสมุทรปราการ",
    "subDistrict": "ปากน้ำ"
    "region": "ภาคกลาง"
  },
  {
    "code": 10270,
    "province": "สมุทรปราการ",
    "district": "เมืองสมุทรปราการ",
    "subDistrict": "สำโรงเหนือ",
    "region": "ภาคกลาง"
  },
  {
    "code": 10270,
    "province": "สมุทรปราการ",
    "district": "เมืองสมุทรปราการ",
    "subDistrict": "บางเมือง",
    "region": "ภาคกลาง"
  },
```

# License

[Open Software License ("OSL")](LICENSE)
