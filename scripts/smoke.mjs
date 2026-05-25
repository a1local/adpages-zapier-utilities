import { readFile } from "node:fs/promises";
import { runAllRecipes } from "../src/recipes.mjs";

const inputUrl = new URL("../examples/sample-zap-input.json", import.meta.url);
const input = JSON.parse(await readFile(inputUrl, "utf8"));
const output = runAllRecipes(input);

assert(output.utm.url.includes("utm_campaign=perth-electrician-leads"), "UTM campaign was not applied.");
assert(output.adCopy.valid === true, "Sample ad copy should be valid.");
assert(output.localBusinessSchema.schema["@type"] === "Electrician", "Business type was not preserved.");
assert(output.landingPageChecklist.checks.length >= 5, "Checklist should include core items.");

console.log(JSON.stringify(output, null, 2));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
