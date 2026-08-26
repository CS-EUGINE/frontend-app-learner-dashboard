import getLearnerHeaderMenu from './LearnerDashboardMenu';

const build = (authenticatedUser) => getLearnerHeaderMenu(
  (msg) => msg.defaultMessage,
  '/courses',
  authenticatedUser,
  () => {},
  0,
  false,
  0,
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
