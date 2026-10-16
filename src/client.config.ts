/**
 * client.config.ts: the ONE switch for rank-and-rent mode.
 *
 * hasClient: false  (placeholder mode, the default before a client is signed)
 *   - no phone number or call buttons anywhere (the calls to action become the quote form)
 *   - no street address; the schema carries the service area only
 *   - no licence numbers and no "Licensed & Insured" claim; trust badge reads "Certified Professionals"
 *   - an HTML comment "PLACEHOLDER MODE ACTIVE" is added to every page head
 *
 * hasClient: true  (a client has been onboarded): fill in the fields below and flip the flag. The phone,
 * address, licence numbers, trust badge, Google profile link and full LocalBusiness schema switch on everywhere.
 *
 * The site's own brand (site.config.ts businessName) never changes: the client operates our brand next to
 * their own. businessName below is the CLIENT'S operating name; it is used as legalName in the schema only.
 * Leave unknown values as empty strings. Never invent licence numbers.
 */
export interface ClientConfig {
  hasClient: boolean;
  businessName: string;
  phone: string;
  address: { street: string; city: string; state: string; zip: string };
  tceqLicenseNumber: string;
  tdlrLicenseNumber: string;
  googleProfileUrl: string;
}

export const clientConfig: ClientConfig = {
  hasClient: false,

  // Fill these in when a client is onboarded:
  businessName: "", // the client's own business name, e.g. "Acme Water Treatment LLC"
  phone: "", // e.g. "(806) 555-0192"
  address: {
    street: "",
    city: "",
    state: "TX",
    zip: "",
  },
  tceqLicenseNumber: "", // TCEQ Water Treatment Specialist license
  tdlrLicenseNumber: "", // TDLR plumbing license (if applicable)
  googleProfileUrl: "",
};
