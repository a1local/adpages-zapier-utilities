// Code by Zapier input fields:
// name, url, businessType, phone, image, description, priceRange,
// streetAddress, locality, region, postalCode, country, serviceAreas

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

function setIfPresent(target, key, value) {
  const normalized = optionalString(value);
  if (normalized) {
    target[key] = normalized;
  }
}

function toList(value) {
  return optionalString(value)
    .split(",")
    .map(function (item) { return item.trim(); })
    .filter(Boolean);
}

const schema = {
  "@context": "https://schema.org",
  "@type": optionalString(inputData.businessType) || "LocalBusiness",
  name: requiredString(inputData.name, "name"),
  url: requiredString(inputData.url, "url")
};

setIfPresent(schema, "telephone", inputData.phone);
setIfPresent(schema, "image", inputData.image);
setIfPresent(schema, "description", inputData.description);
setIfPresent(schema, "priceRange", inputData.priceRange);

const address = {
  "@type": "PostalAddress"
};

setIfPresent(address, "streetAddress", inputData.streetAddress);
setIfPresent(address, "addressLocality", inputData.locality);
setIfPresent(address, "addressRegion", inputData.region);
setIfPresent(address, "postalCode", inputData.postalCode);
setIfPresent(address, "addressCountry", inputData.country);

if (Object.keys(address).length > 1) {
  schema.address = address;
}

const areas = toList(inputData.serviceAreas);
if (areas.length > 0) {
  schema.areaServed = areas.map(function (area) {
    return { "@type": "Place", name: area };
  });
}

output = {
  schema: schema,
  jsonLd: JSON.stringify(schema, null, 2)
};
