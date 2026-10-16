/**
 * phone.ts: one place that decides whether the phone number is shown.
 * site.config.ts showPhone: false hides every phone number and call button; the calls to action become the quote form.
 * A placeholder number (PHONE_NUMBER or a number ending 000-0000) is never shown, whatever showPhone says.
 */
import { siteConfig as site } from "../site.config";

const isPlaceholder = (p: string) => !p || p === "PHONE_NUMBER" || /000-0000/.test(p);

export const phoneVisible: boolean = site.showPhone && !isPlaceholder(site.phoneNumber);
export const telHref: string = phoneVisible ? `tel:${site.phoneNumber.replace(/[^\d+]/g, "")}` : "/#estimate";
export const primaryCta: { href: string; text: string } = phoneVisible
  ? { href: telHref, text: `📞 ${site.phoneNumber}` }
  : { href: "/#estimate", text: "Get a Free Estimate" };
