import getLearnerHeaderMenu from './LearnerDashboardMenu';

const build = (authenticatedUser) => getLearnerHeaderMenu(
  (msg) => msg.defaultMessage,
  '/courses',
  authenticatedUser,
  () => {},
  0,
  false,
  false,
  0,
  {},
  false,
);

const labels = (menu) => menu.userMenu.flatMap(group => group.items.map(item => item.content));
const hrefs = (menu) => menu.userMenu.flatMap(group => group.items.map(item => item.href));

describe('staff dashboard entry in the user menu', () => {
  test('staff see it, pointing at the LMS /staff page', () => {
    const menu = build({ username: 'cloudswyft_staff', administrator: true });
    expect(labels(menu)).toContain('Staff Dashboard');
    expect(hrefs(menu).some(href => href && href.endsWith('/staff'))).toBe(true);
  });

  test('learners do not', () => {
    expect(labels(build({ username: 'learner', administrator: false }))).not.toContain('Staff Dashboard');
  });

  test('an unresolved user does not', () => {
    expect(labels(build(null))).not.toContain('Staff Dashboard');
  });

  test('it sits above Sign Out and leaves the personal links in order', () => {
    const menu = build({ username: 'cloudswyft_staff', administrator: true });
    const all = labels(menu);
    expect(all.indexOf('Staff Dashboard')).toBeLessThan(all.indexOf('Sign Out'));
    expect(all.indexOf('Dashboard')).toBeLessThan(all.indexOf('Staff Dashboard'));
  });
});

describe('bulk registration entry in the user menu', () => {
  test('superusers see it and it points to the LMS bulk registration page', () => {
    const menu = getLearnerHeaderMenu(
      (msg) => msg.defaultMessage,
      '/courses',
      { username: 'cloudswyft_admin' },
      () => {},
      0,
      false,
      false,
      0,
      {},
      true,
    );
    expect(labels(menu)).toContain('Bulk user registration');
    expect(hrefs(menu).some(href => href && href.endsWith('/support/bulk_registration'))).toBe(true);
  });

  test('the entry is hidden when the server does not grant access', () => {
    const menu = build({ username: 'cloudswyft_staff', administrator: true });
    expect(labels(menu)).not.toContain('Bulk user registration');
  });
});

describe('purchase history entry in the user menu', () => {
  test('every learner gets it, inside the router basename', () => {
    const menu = build({ username: 'learner', administrator: false });
    expect(labels(menu)).toContain('Purchase History');
    expect(hrefs(menu).some(href => href && href.endsWith('purchases'))).toBe(true);
  });

  test('it sits with the personal links, after Account', () => {
    const all = labels(build({ username: 'learner', administrator: false }));
    expect(all.indexOf('Account')).toBeLessThan(all.indexOf('Purchase History'));
    expect(all.indexOf('Purchase History')).toBeLessThan(all.indexOf('Sign Out'));
  });
});
