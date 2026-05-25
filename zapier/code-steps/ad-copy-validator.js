// Code by Zapier input fields:
// headline, description, cta, headlineMax, descriptionMax

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toPositiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function issue(code, message) {
  return { code: code, message: message };
}

const headline = optionalString(inputData.headline);
const description = optionalString(inputData.description);
const cta = optionalString(inputData.cta);
const limits = {
  headlineMax: toPositiveInteger(inputData.headlineMax, 30),
  descriptionMax: toPositiveInteger(inputData.descriptionMax, 90)
};
const issues = [];

if (!headline) {
  issues.push(issue("headline_missing", "Headline is required."));
} else if (headline.length > limits.headlineMax) {
  issues.push(issue("headline_too_long", "Headline is " + headline.length + " characters; limit is " + limits.headlineMax + "."));
}

if (!description) {
  issues.push(issue("description_missing", "Description is required."));
} else if (description.length > limits.descriptionMax) {
  issues.push(issue("description_too_long", "Description is " + description.length + " characters; limit is " + limits.descriptionMax + "."));
}

if (!cta) {
  issues.push(issue("cta_missing", "CTA is recommended for conversion-focused ads."));
}

if (/[!?]{2,}/.test(headline + " " + description)) {
  issues.push(issue("punctuation_repetition", "Avoid repeated exclamation or question marks."));
}

if (/\b(guaranteed|free money|risk[- ]?free|miracle)\b/i.test(headline + " " + description)) {
  issues.push(issue("risky_claim", "Review absolute or high-risk promotional claims before publishing."));
}

output = {
  valid: issues.length === 0,
  headlineLength: headline.length,
  descriptionLength: description.length,
  limits: limits,
  issues: issues
};
