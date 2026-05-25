// Code by Zapier input fields:
// pageName, campaign

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

const pageName = optionalString(inputData.pageName) || "Landing page";
const campaign = optionalString(inputData.campaign);
const checks = [
  {
    id: "message_match",
    label: "Message match",
    detail: "The landing-page headline reflects the ad promise and primary keyword.",
    status: "todo"
  },
  {
    id: "single_primary_cta",
    label: "Single primary CTA",
    detail: "The page has one dominant conversion action above the fold.",
    status: "todo"
  },
  {
    id: "local_trust",
    label: "Local trust",
    detail: "The page includes location, service area, testimonials, or proof relevant to the visitor.",
    status: "todo"
  },
  {
    id: "mobile_speed",
    label: "Mobile speed",
    detail: "The page is usable on mobile and avoids heavy assets that slow first interaction.",
    status: "todo"
  },
  {
    id: "tracking_ready",
    label: "Tracking ready",
    detail: "Form submits, calls, and primary CTA clicks can be measured.",
    status: "todo"
  },
  {
    id: "privacy_visible",
    label: "Privacy visible",
    detail: "Forms include reasonable consent context and link to the business privacy policy.",
    status: "todo"
  }
];

output = {
  pageName: pageName,
  campaign: campaign,
  checks: checks,
  summary: checks.length + " review items generated for " + pageName + "."
};
