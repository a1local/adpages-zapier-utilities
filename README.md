# AdPages Zapier Utilities

This is a lightweight resource scaffold for AdPages automation utilities. It is intended for two near-term uses:

- Copy-paste recipes for **Code by Zapier** steps.
- A local reference package for shaping a future Zapier Platform app.

It is not a submitted or marketplace-ready Zapier app. A Zapier Platform app should wait until AdPages has hosted API endpoints, authentication decisions, rate limits, error contracts, and production privacy review.

## Included Recipes

- UTM URL generation.
- Ad-copy validation.
- LocalBusiness JSON-LD generation.
- Landing-page checklist generation.

All current recipes are dependency-free, deterministic, and local-only. They do not make network calls, scrape pages, enrich contacts, send outreach, or require credentials.

## Local Usage

```bash
npm run check
npm run smoke
```

The smoke script reads `examples/sample-zap-input.json` and writes a representative output to stdout.

## Code By Zapier Usage

1. Add a Code by Zapier step to a Zap.
2. Choose JavaScript.
3. Paste one recipe from `zapier/code-steps/`.
4. Map Zap fields into the input names shown at the top of the recipe file.
5. Test the step and inspect the returned object.

Each Code by Zapier recipe is standalone JavaScript. The snippets intentionally avoid imports so they can be pasted directly into Zapier.

## Future Platform App Notes

A future Zapier Platform app could expose these utilities as create/search actions after the product has:

- A hosted API with stable request and response contracts.
- Authentication and authorization decisions.
- Clear tenant boundaries for customer data.
- Logging, retry, and rate-limit behavior.
- Marketplace review materials and a production privacy policy.

Until then, treat this folder as a utility resource scaffold only.

## Publisher

Built by [AdPages from A1 Local](https://a1local.com.au/extensions/) as a free, dependency-light resource for local-service marketers, web designers, and small business site owners.
