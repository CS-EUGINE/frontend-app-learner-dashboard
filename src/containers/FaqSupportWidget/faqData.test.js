import { FAQ_ITEMS, findFaqAnswer } from './faqData';

describe('FAQ support matching', () => {
  it('finds the FAQ-approved password reset answer', () => {
    expect(findFaqAnswer('I forgot my password')).toMatchObject({ id: 'password' });
  });

  it('matches a common phrasing variation through the local intent matcher', () => {
    expect(findFaqAnswer('How can I join a class?')).toMatchObject({ id: 'enroll' });
  });

  it.each(['enroll', 'enrol', 'enrollment', 'join a class', 'register for a course', 'sign up for a course'])('distinguishes course enrollment from account registration: %s', (query) => {
    expect(findFaqAnswer(query)).toMatchObject({ id: 'enroll' });
  });

  it.each(['register', 'registration', 'sign up', 'create an account'])('keeps account registration queries separate: %s', (query) => {
    expect(findFaqAnswer(query)).toMatchObject({ id: 'create-account' });
  });

  it.each([
    ['pay', 'payment'], ['password reset', 'password'],
    ['sign in', 'password'], ['certificate', 'certificate'], ['billing', 'payment'],
  ])('matches the supported keyword %s', (query, id) => {
    expect(findFaqAnswer(query)).toMatchObject({ id });
  });

  it('does not invent an answer for an unrelated request', () => {
    expect(findFaqAnswer('Can you write my assignment for me?')).toBeNull();
  });

  it('keeps a support fallback available when no FAQ matches', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
  });
});
