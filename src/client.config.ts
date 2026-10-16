/**
 * client.config.ts: the ONE switch for rank-and-rent mode. Edit only this file when a client is onboarded.
 * Components never read it directly: they import the derived values from src/lib/clientMode.ts.
 *
 * hasClient: false  (placeholder mode, the default before a client is signed)
 *   - no phone number or call buttons (the calls to action become the quote form), no street address
 *   - no licence numbers, years in business, guarantee, same-day claim or reviews (those sections are absent from the page)
 *   - the schema carries the service area only
 *   - an HTML comment "PLACEHOLDER MODE ACTIVE" is added to every page head
 *
 * hasClient: true  (a client has been onboarded): fill in the fields below and flip the flag. Every filled field
 * switches on everywhere it is used; every blank field simply stays hidden. Never invent values here.
 *
 * The site's own brand (site.config.ts businessName) never changes: the client operates our brand next to their own,
 * so businessName below is the CLIENT'S operating name and feeds the schema legalName only.
 */
export interface ClientConfig {
  hasClient: boolean;

  // Identity
  businessName: string;
  phone: string;
  googleProfileUrl: string;

  // Location
  address: { street: string; city: string; state: string; zip: string };

  // Credentials
  tceqLicenseNumber: string;
  tdlrLicenseNumber: string;
  yearsInBusiness: number;

  // Service policies
  sameDayAvailable: boolean;
  laborWarrantyYears: number;
  satisfactionGuarantee: string; // e.g. "100% satisfaction or we return free of charge"

  // Pricing
  priceRangeOverride: string; // e.g. "$900–$2,200 installed"; leave empty to use the market-average copy

  // Reviews
  reviewsUrl: string; // Google review link
  reviewCount: number;
  averageRating: number;
}

export const clientConfig: ClientConfig = {
  hasClient: false,

  // Identity
  businessName: "",
  phone: "",
  googleProfileUrl: "",

  // Location
  address: {
    street: "",
    city: "",
    state: "TX",
    zip: "",
  },

  // Credentials
  tceqLicenseNumber: "",
  tdlrLicenseNumber: "",
  yearsInBusiness: 0,

  // Service policies
  sameDayAvailable: false,
  laborWarrantyYears: 0,
  satisfactionGuarantee: "",

  // Pricing
  priceRangeOverride: "",

  // Reviews
  reviewsUrl: "",
  reviewCount: 0,
  averageRating: 0,
};
