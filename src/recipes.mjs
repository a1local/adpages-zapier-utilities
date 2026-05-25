const DEFAULT_AD_LIMITS = {
  headlineMax: 30,
  descriptionMax: 90
};

const CHECKLIST_ITEMS = [
  {
    id: "message_match",
    label: "Message match",
    detail: "The landing-page headline reflects the ad promise and primary keyword."
  },
  {
    id: "single_primary_cta",
    label: "Single primary CTA",
    detail: "The page has one dominant conversion action above the fold."
  },
  {
    id: "local_trust",
    label: "Local trust",
    detail: "The page includes location, service area, testimonials, or proof relevant to the visitor."
  },
  {
    id: "mobile_speed",
    label: "Mobile speed",
    detail: "The page is usable on mobile and avoids heavy assets that slow first interaction."
  },
  {
    id: "tracking_ready",
    label: "Tracking ready",
    detail: "Form submits, calls, and primary CTA clicks can be measured."
  },
  {
    id: "privacy_visible",
    label: "Privacy visible",
    detail: "Forms include reasonable consent context and link to the business privacy policy."
  }
];

export function buildUtmUrl(input = {}) {
  const baseUrl = requiredString(input.baseUrl, "baseUrl");
  const url = new URL(baseUrl);
  const utmFields = {
    utm_source: input.source,
    utm_medium: input.medium,
    utm_campaign: input.campaign,
    utm_term: input.term,
    utm_content: input.content
  };

  for (const [key, value] of Object.entries(utmFields)) {
    const normalized = optionalString(value);
    if (normalized) {
      url.searchParams.set(key, normalized);
    }
  }

  return {
    url: url.toString(),
    parameters: Object.fromEntries(url.searchParams.entries())
  };
}

export function validateAdCopy(input = {}) {
  const headline = optionalString(input.headline);
  const description = optionalString(input.description);
  const cta = optionalString(input.cta);
  const limits = {
    headlineMax: toPositiveInteger(input.headlineMax, DEFAULT_AD_LIMITS.headlineMax),
    descriptionMax: toPositiveInteger(input.descriptionMax, DEFAULT_AD_LIMITS.descriptionMax)
  };
  const issues = [];

  if (!headline) {
    issues.push(issue("headline_missing", "Headline is required."));
  } else if (headline.length > limits.headlineMax) {
    issues.push(issue("headline_too_long", `Headline is ${headline.length} characters; limit is ${limits.headlineMax}.`));
  }

  if (!description) {
    issues.push(issue("description_missing", "Description is required."));
  } else if (description.length > limits.descriptionMax) {
    issues.push(issue("description_too_long", `Description is ${description.length} characters; limit is ${limits.descriptionMax}.`));
  }

  if (!cta) {
    issues.push(issue("cta_missing", "CTA is recommended for conversion-focused ads."));
  }

  if (/[!?]{2,}/.test(`${headline} ${description}`)) {
    issues.push(issue("punctuation_repetition", "Avoid repeated exclamation or question marks."));
  }

  if (/\b(guaranteed|free money|risk[- ]?free|miracle)\b/i.test(`${headline} ${description}`)) {
    issues.push(issue("risky_claim", "Review absolute or high-risk promotional claims before publishing."));
  }

  return {
    valid: issues.length === 0,
    headlineLength: headline.length,
    descriptionLength: description.length,
    limits,
    issues
  };
}

export function generateLocalBusinessSchema(input = {}) {
  const name = requiredString(input.name, "name");
  const url = requiredString(input.url, "url");
  const schema = {
    "@context": "https://schema.org",
    "@type": optionalString(input.businessType) || "LocalBusiness",
    name,
    url
  };

  setIfPresent(schema, "telephone", input.phone);
  setIfPresent(schema, "image", input.image);
  setIfPresent(schema, "description", input.description);
  setIfPresent(schema, "priceRange", input.priceRange);

  const address = cleanObject({
    "@type": "PostalAddress",
    streetAddress: input.streetAddress,
    addressLocality: input.locality,
    addressRegion: input.region,
    postalCode: input.postalCode,
    addressCountry: input.country
  });

  if (Object.keys(address).length > 1) {
    schema.address = address;
  }

  const areas = toList(input.serviceAreas);
  if (areas.length > 0) {
    schema.areaServed = areas.map((area) => ({ "@type": "Place", name: area }));
  }

  return {
    schema,
    jsonLd: JSON.stringify(schema, null, 2)
  };
}

export function generateLandingPageChecklist(input = {}) {
  const pageName = optionalString(input.pageName) || "Landing page";
  const campaign = optionalString(input.campaign);
  const checks = CHECKLIST_ITEMS.map((item) => ({
    ...item,
    status: "todo"
  }));

  return {
    pageName,
    campaign,
    checks,
    summary: `${checks.length} review items generated for ${pageName}.`
  };
}

export function runAllRecipes(input = {}) {
  return {
    utm: buildUtmUrl(input.utm || {}),
    adCopy: validateAdCopy(input.adCopy || {}),
    localBusinessSchema: generateLocalBusinessSchema(input.localBusiness || {}),
    landingPageChecklist: generateLandingPageChecklist(input.landingPage || {})
  };
}

function requiredString(value, fieldName) {
  const normalized = optionalString(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toPositiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function toList(value) {
  if (Array.isArray(value)) {
    return value.map(optionalString).filter(Boolean);
  }
  return optionalString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => optionalString(value) || value === "PostalAddress")
  );
}

function setIfPresent(target, key, value) {
  const normalized = optionalString(value);
  if (normalized) {
    target[key] = normalized;
  }
}

function issue(code, message) {
  return { code, message };
}
