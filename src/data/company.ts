/**
 * Legal facts, defined once. The Impressum and Datenschutz pages render from
 * here, so a value corrected here is corrected in both locales at once.
 *
 * The figures are the commercial-register entry of 2026-09-04, published in
 * the SOGC on 2026-09-09. Change them only against the register, never against
 * a document that quotes it.
 */
export interface CompanyAddress {
  street: string;
  postalCode: string;
  city: string;
  /** ISO 3166-1 alpha-2. The country's *name* is copy, so it lives in `i18n`. */
  countryCode: string;
}

export const COMPANY = {
  name: 'Faviens',
  /** Legal form, appended to the name to give the registered legal name. */
  legalForm: 'GmbH',
  /** Swiss business identification number, CHE-xxx.xxx.xxx. */
  uid: 'CHE-301.720.050',
  /** Sole managing director, with individual signing authority. */
  representative: 'Daniel Vogler',
  address: {
    street: 'Stäblistrasse 1',
    postalCode: '8006',
    city: 'Zürich',
    countryCode: 'CH',
  } as CompanyAddress,
  /** Fallback for {@link CONTACT_EMAIL}. Render that, never this. */
  email: 'info@faviens.com',
  /**
   * Where applications go. A second address rather than the general one, so a
   * job ad quoted off-site does not route a CV into the sales inbox. It takes
   * no environment override: an application address that differs between a
   * preview build and production sends a candidate's CV nowhere.
   */
  applyEmail: 'apply@faviens.com',
} as const;

/** The registered legal name, `Faviens GmbH`, in every locale. */
export const LEGAL_NAME = `${COMPANY.name} ${COMPANY.legalForm}`;

/**
 * The contact address as rendered, everywhere. The `CONTACT_EMAIL` environment
 * variable wins where one is set, otherwise the address in `COMPANY`.
 *
 * `||` and not `??`: an unset GitHub Actions secret expands to an empty string,
 * which is not nullish, so `??` would let the empty value through.
 */
export const CONTACT_EMAIL: string = import.meta.env.CONTACT_EMAIL || COMPANY.email;

/** The address a job ad tells candidates to write to. */
export const APPLY_EMAIL: string = COMPANY.applyEmail;

/**
 * Address lines in Swiss postal order. The country name is passed in rather
 * than stored: it is copy, and an English page reading `Schweiz` is the bug
 * this signature exists to prevent.
 */
export function addressLines(address: CompanyAddress, country: string): string[] {
  return [address.street, `${address.postalCode} ${address.city}`, country];
}
