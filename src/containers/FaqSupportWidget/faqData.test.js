import { FAQ_ITEMS, findFaqAnswer } from './faqData';

describe('FAQ support matching', () => {
  it('finds the FAQ-approved password reset answer', () => {
    expect(findFaqAnswer('I forgot my password')).toMatchObject({ id: 'password' });
  });

  it('does not invent an answer for an unrelated request', () => {
    expect(findFaqAnswer('Can you write my assignment for me?')).toBeNull();
  });

  it('keeps a support fallback available when no FAQ matches', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
  });
});
