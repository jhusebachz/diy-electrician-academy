const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'google.com',
  'osha.gov',
  'nfpa.org',
  'esfi.org',
  'nist.gov',
  'owasp.org',
] as const;

export type UrlValidationResult =
  | {
      ok: true;
      url: string;
      hostname: string;
    }
  | {
      ok: false;
      reason: string;
    };

export function isAllowedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized === domain || normalized.endsWith(`.${domain}`));
}

export function validateExternalUrl(input: string): UrlValidationResult {
  let parsed: URL;

  try {
    parsed = new URL(input);
  } catch {
    return {
      ok: false,
      reason: 'This link is malformed and was not opened.',
    };
  }

  if (parsed.protocol !== 'https:') {
    return {
      ok: false,
      reason: 'Only HTTPS links are allowed.',
    };
  }

  if (!isAllowedHostname(parsed.hostname)) {
    return {
      ok: false,
      reason: `Links to ${parsed.hostname} are not allowed in this MVP.`,
    };
  }

  return {
    ok: true,
    url: parsed.toString(),
    hostname: parsed.hostname,
  };
}
