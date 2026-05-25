// Code by Zapier input fields:
// baseUrl, source, medium, campaign, term, content

function requiredString(value, fieldName) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    throw new Error(fieldName + " is required");
  }
  return normalized;
}

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

const url = new URL(requiredString(inputData.baseUrl, "baseUrl"));
const fields = {
  utm_source: inputData.source,
  utm_medium: inputData.medium,
  utm_campaign: inputData.campaign,
  utm_term: inputData.term,
  utm_content: inputData.content
};

Object.keys(fields).forEach(function (key) {
  const value = optionalString(fields[key]);
  if (value) {
    url.searchParams.set(key, value);
  }
});

output = {
  url: url.toString(),
  parameters: Object.fromEntries(url.searchParams.entries())
};
