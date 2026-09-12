import { claimReference, plateKey } from '@/models/types';

describe('claimReference', () => {
  const createdAt = new Date('2026-09-12T10:00:00Z');

  it('reads SIN-<year>-<4 digits> and is stable for a claim', () => {
    const reference = claimReference({ id: '10000003-0000-0000-0000-000000000003', createdAt });
    expect(reference).toMatch(/^SIN-2026-\d{4}$/);
    expect(claimReference({ id: '10000003-0000-0000-0000-000000000003', createdAt })).toBe(reference);
  });

  it('differs between claims', () => {
    const a = claimReference({ id: 'a', createdAt });
    const b = claimReference({ id: 'b', createdAt });
    expect(a).not.toBe(b);
  });
});

describe('plateKey', () => {
  it('ignores case, spaces and dashes', () => {
    expect(plateKey('AA-123-BB')).toBe('AA123BB');
    expect(plateKey(' aa 123 bb ')).toBe('AA123BB');
    expect(plateKey('AA123BB')).toBe(plateKey('aa-123-bb'));
  });
});
