import { describe, expect, it } from 'vitest';

import { validateExternalUrl } from '@/domain/urlAllowlist';

describe('URL allowlist', () => {
  it('allows HTTPS YouTube domains', () => {
    expect(validateExternalUrl('https://www.youtube.com/results?search_query=gfci').ok).toBe(true);
    expect(validateExternalUrl('https://youtu.be/example').ok).toBe(true);
  });

  it('allows approved safety domains', () => {
    expect(validateExternalUrl('https://www.osha.gov/electrical').ok).toBe(true);
    expect(validateExternalUrl('https://www.nist.gov/').ok).toBe(true);
  });

  it('blocks HTTP links', () => {
    expect(validateExternalUrl('http://youtube.com/watch?v=test')).toEqual({
      ok: false,
      reason: 'Only HTTPS links are allowed.',
    });
  });

  it('blocks unknown domains', () => {
    const result = validateExternalUrl('https://example.com/video');

    expect(result.ok).toBe(false);
  });

  it('blocks malformed input', () => {
    expect(validateExternalUrl('not a url')).toEqual({
      ok: false,
      reason: 'This link is malformed and was not opened.',
    });
  });
});
