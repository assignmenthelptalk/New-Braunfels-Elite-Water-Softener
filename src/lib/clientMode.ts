/**
 * clientMode.ts: every value derived from src/client.config.ts. Components, the layout and the schema import ONLY
 * from here (never from the config), so one edit to client.config.ts changes the whole site.
 *
 * Rules: a claim is shown only when the data behind it exists. Where a value is null, the section that uses it
 * is not rendered at all (absent from the DOM, not hidden with CSS).
 */
import { clientConfig as c } from "../client.config";
import { siteConfig as site } from "../site.config";

const clean = (s: string | undefined): string => (s ?? "").trim();
const num = (n: number | undefined): number => (typeof n === "number" && Number.isFinite(n) ? n : 0);

export const hasClient: boolean = c.hasClient === true;

// ---- identity ----------------------------------------------------------------------------------------------------
/** Real phone, or null in placeholder mode (or when the client has no number yet). */
export const phone: string | null = hasClient && clean(c.phone) ? clean(c.phone) : null;
/** True only when a phone number is set: gates every phone number and call button. */
export const ctaShowPhone: boolean = phone !== null;
/** The client's own business name (schema legalName only); the site brand never changes. */
export const legalName: string = hasClient ? clean(c.businessName) : "";
export const googleProfileUrl: string = hasClient ? clean(c.googleProfileUrl) : "";

// ---- credentials -------------------------------------------------------------------------------------------------
export const licences: { body: string; short: string; number: string }[] = hasClient
  ? [
      { body: "TCEQ Water Treatment Specialist", short: "TCEQ", number: clean(c.tceqLicenseNumber) },
      { body: "TDLR plumbing", short: "TDLR", number: clean(c.tdlrLicenseNumber) },
    ].filter((l) => l.number)
  : [];

/** "Licensed & Insured · TCEQ #n" when a licence number is filled in, else the generic badge. */
export const trustBadge: string = licences.length
  ? `Licensed & Insured · ${licences.map((l) => `${l.short} #${l.number}`).join(" · ")}`
  : "Certified Water Treatment Professionals";

/** "Serving [city] for [n] years", or null. */
export const yearsLabel: string | null =
  hasClient && num(c.yearsInBusiness) > 0
    ? `Serving ${site.city} for ${num(c.yearsInBusiness)} ${num(c.yearsInBusiness) === 1 ? "year" : "years"}`
    : null;

// ---- service policies --------------------------------------------------------------------------------------------
/** "[n]-year labor warranty", or null (no warranty claim is made unless the client states one). */
export const warrantyLabel: string | null =
  hasClient && num(c.laborWarrantyYears) > 0 ? `${num(c.laborWarrantyYears)}-year labor warranty` : null;

/** The client's real guarantee, or null (the guarantee block is not rendered). */
export const guaranteeText: string | null = hasClient && clean(c.satisfactionGuarantee) ? clean(c.satisfactionGuarantee) : null;

/** "Same-day service available", or null (the badge is not rendered). */
export const sameDayLabel: string | null = hasClient && c.sameDayAvailable === true ? "Same-day service available" : null;

// ---- pricing -----------------------------------------------------------------------------------------------------
const MARKET_RANGE = "$800–$2,500"; // market-average placeholder copy; replaced by priceRangeOverride for a client
/** The client's price range if set, else the market-average sentence. */
export const priceRangeCopy: string =
  hasClient && clean(c.priceRangeOverride)
    ? clean(c.priceRangeOverride)
    : `Most ${site.city} homeowners pay ${MARKET_RANGE} installed`;
/** The client's own range for the schema priceRange field, or null. */
export const priceRangeSchema: string | null = hasClient && clean(c.priceRangeOverride) ? clean(c.priceRangeOverride) : null;

// ---- reviews -----------------------------------------------------------------------------------------------------
export interface ReviewsBlock {
  count: number;
  rating: number;
  /** star glyphs, e.g. "★★★★★" rounded to the nearest whole star */
  stars: string;
  label: string;
  url: string | null;
}
export const reviewsBlock: ReviewsBlock | null =
  hasClient && num(c.reviewCount) > 0 && num(c.averageRating) > 0
    ? {
        count: num(c.reviewCount),
        rating: Math.min(5, num(c.averageRating)),
        stars: "★".repeat(Math.round(Math.min(5, num(c.averageRating)))) + "☆".repeat(5 - Math.round(Math.min(5, num(c.averageRating)))),
        label: `${Math.min(5, num(c.averageRating)).toFixed(1)} out of 5 from ${num(c.reviewCount)} Google ${num(c.reviewCount) === 1 ? "review" : "reviews"}`,
        url: clean(c.reviewsUrl) || null,
      }
    : null;

// ---- location ----------------------------------------------------------------------------------------------------
/** Full PostalAddress for the schema, or null (the schema then carries areaServed only). */
export const schemaAddress: {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: "US";
} | null =
  hasClient && clean(c.address.street) && clean(c.address.city)
    ? {
        "@type": "PostalAddress",
        streetAddress: clean(c.address.street),
        addressLocality: clean(c.address.city),
        addressRegion: clean(c.address.state),
        postalCode: clean(c.address.zip),
        addressCountry: "US",
      }
    : null;

/** One printable line for the footer and the Contact page, or null. */
export const addressLine: string | null = schemaAddress
  ? `${schemaAddress.streetAddress}, ${schemaAddress.addressLocality}, ${schemaAddress.addressRegion} ${schemaAddress.postalCode}`.trimEnd()
  : null;
