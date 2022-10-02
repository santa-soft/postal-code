import { ensureFile, readCSVObjects } from "./deps.ts";
import { PostalAddress } from "./types.ts";

const outputFilePath = "./.local/th/postal_codes.json";
const f = await Deno.open("./raw-data/ThepExcel-Thailand-Tambon.csv");
const addresses: Array<PostalAddress> = [];

for await (const row of readCSVObjects(f)) {
  addresses.push({
    code: parseInt(row.PostCodeMajor),
    province: {
      en: row.ProvinceEng,
      th: row.ProvinceThai,
    },
    district: {
      en: row.DistrictEngShort,
      th: row.DistrictThaiShort,
    },
    subDistrict: {
      en: row.TambonEngShort,
      th: row.TambonThaiShort,
    },
    region: row.Region,
  });
  console.log("row:", addresses.at(-1));
}

await ensureFile(outputFilePath);
await Deno.writeTextFile(outputFilePath, JSON.stringify(addresses), {
  append: false,
});

f.close();
