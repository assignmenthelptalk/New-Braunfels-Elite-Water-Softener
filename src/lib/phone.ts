/**
 * phone.ts: phone display values for the templates, all derived from clientMode.ts (src/client.config.ts).
 * Placeholder mode (hasClient: false): no number, no tel: link, and the calls to action become the quote form.
 */
import { phone, ctaShowPhone } from "./clientMode";

export const phoneVisible: boolean = ctaShowPhone;
export const phoneNumber: string = phone ?? "";
export const telHref: string = phoneVisible ? `tel:${phoneNumber.replace(/[^\d+]/g, "")}` : "/#estimate";
export const primaryCta: { href: string; text: string } = phoneVisible
  ? { href: telHref, text: `\u{1F4DE} ${phoneNumber}` }
  : { href: "/#estimate", text: "Get a Free Estimate" };
