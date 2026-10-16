/**
 * clientMode.ts: values derived from src/client.config.ts. Every page, the layout and the schema read these,
 * so one edit (hasClient and the client's details) changes the whole site. Nothing here invents data:
 * a blank field stays blank, and a claim is only shown when its supporting data exists.
 */
import { clientConfig as c } from "../client.config";

const clean = (s: string | undefined): string => (s ?? "").trim();

export const hasClient: boolean = c.hasClient === true;

/** Real phone, or null in placeholder mode (or when the client has no number yet). */
export const phone: string | null = hasClient && clean(c.phone) ? clean(c.phone) : null;

/** Show phone numbers and call buttons only when there is a real number to show. */
export const ctaShowPhone: boolean = phone !== null;

/** Licences the client supplied (blank fields are skipped). */
export const licences: { body: string; short: string; number: string }[] = hasClient
  ? [
      { body: "TCEQ Water Treatment Specialist", short: "TCEQ", number: clean(c.tceqLicenseNumber) },
      { body: "TDLR plumbing", short: "TDLR", number: clean(c.tdlrLicenseNumber) },
    ].filter((l) => l.number)
  : [];

/** "Licensed & Insured" with the numbers once a client has supplied a licence; otherwise "Certified Professionals". */
export const trustBadge: string =
  hasClient && licences.length
    ? `Licensed & Insured · ${licences.map((l) => `${l.short} #${l.number}`).join(" · ")}`
    : "Certified Professionals";

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

/** One printable line for the footer and Contact page, or null. */
export const addressLine: string | null = schemaAddress
  ? `${schemaAddress.streetAddress}, ${schemaAddress.addressLocality}, ${schemaAddress.addressRegion} ${schemaAddress.postalCode}`.replace(/\s+$/, "")
  : null;

/** The client's own business name, for the schema legalName only. The site brand never changes. */
export const legalName: string = hasClient ? clean(c.businessName) : "";

export const googleProfileUrl: string = hasClient ? clean(c.googleProfileUrl) : "";
