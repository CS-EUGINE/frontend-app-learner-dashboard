/**
 * The site header, the same on every MFE and matching the LMS navbar.
 *
 * ONE COMPONENT, FOUR COPIES. This folder (SiteHeader.jsx/.scss and the
 * NotificationsDrawer.jsx/.scss it can open) is identical in frontend-app-learner-dashboard, -account, -profile and
 * -learning. Change it in one, copy it to the other three, and check with
 * `md5sum mfes/frontend-app-*\/src/site-header/*`. The LMS side is
 * header/navbar-authenticated.html and header/user_dropdown.html in the
 * Indigo theme; the items, their order and the look must stay in step with it.
 *
 * Why not @edx/frontend-component-header: each app configured that package
 * differently, so no two MFEs looked alike, and tutor-indigo replaces it with
 * its own fork when it builds the MFE images, so dev (the repo's package) and
 * staging (Indigo's) did not match either. This is plain markup with its own
 * class names, so nothing swapped in at build time can restyle it.
 *
 * Measurements are taken from the LMS navbar: 64px bar, 24px logo, 14px/500
 * menu items with a 2px #2848E4 underline on the active one, 22px icons with a
 * red count badge, the username in a #F2F7F8 pill, a 224px dropdown, and the
 * hamburger layout below 992px.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { defineMessages, useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import NotificationsDrawer from './NotificationsDrawer';
import './SiteHeader.scss';

const messages = defineMessages({
  skip: { id: 'site-header.skip', defaultMessage: 'Skip to main content' },
  home: { id: 'site-header.home', defaultMessage: 'Home' },
  mainNav: { id: 'site-header.main-nav', defaultMessage: 'Main' },
  myCourses: { id: 'site-header.my-courses', defaultMessage: 'My courses' },
  discover: { id: 'site-header.discover', defaultMessage: 'Discover' },
  scaleUp: { id: 'site-header.scale-up', defaultMessage: 'Scale-Up' },
  courses: { id: 'site-header.courses', defaultMessage: 'Courses' },
  about: { id: 'site-header.about', defaultMessage: 'About' },
  profiling: { id: 'site-header.profiling', defaultMessage: 'Profiling' },
  register: { id: 'site-header.register', defaultMessage: 'Register for free' },
  signIn: { id: 'site-header.sign-in', defaultMessage: 'Sign in' },
  notifications: { id: 'site-header.notifications', defaultMessage: 'Notifications' },
  notificationsCount: { id: 'site-header.notifications-count', defaultMessage: 'Notifications, {count} unread' },
  cart: { id: 'site-header.cart', defaultMessage: 'Shopping cart' },
  cartCount: { id: 'site-header.cart-count', defaultMessage: 'Shopping cart, {count} courses' },
  userMenu: { id: 'site-header.user-menu', defaultMessage: 'Account menu' },
  openMenu: { id: 'site-header.open-menu', defaultMessage: 'Open menu' },
  closeMenu: { id: 'site-header.close-menu', defaultMessage: 'Close menu' },
  dashboard: { id: 'site-header.dashboard', defaultMessage: 'Dashboard' },
  profile: { id: 'site-header.profile', defaultMessage: 'Profile' },
  account: { id: 'site-header.account', defaultMessage: 'Account' },
  purchases: { id: 'site-header.purchases', defaultMessage: 'Purchase history' },
  authored: { id: 'site-header.authored', defaultMessage: 'Authored courses' },
  staff: { id: 'site-header.staff', defaultMessage: 'Staff dashboard' },
  logout: { id: 'site-header.logout', defaultMessage: 'Logout' },
});

const lms = (path) => `${getConfig().LMS_BASE_URL}${path}`;

/**
 * GET an LMS endpoint and hand one number from it to `setValue`. A failure
 * leaves the value alone: the header is chrome, and a cart or notifications
 * outage must never be the loudest thing on a page that otherwise loaded.
 */
const useLmsCount = (enabled, path, field, setValue) => {
  React.useEffect(() => {
    if (!enabled) { return undefined; }
    let cancelled = false;
    try {
      getAuthenticatedHttpClient().get(lms(path))
        .then(({ data }) => { if (!cancelled) { setValue(data[field] || 0); } })
        .catch(() => {});
    } catch (e) {
      // The http client throws synchronously when auth is not initialised.
    }
    return () => { cancelled = true; };
  }, [enabled, path, field, setValue]);
};

const Badge = ({ count }) => (count > 0
  ? <span className="cs-header__badge" aria-hidden="true">{count > 99 ? '99+' : count}</span>
  : null);
Badge.propTypes = { count: PropTypes.number.isRequired };

// The LMS navbar's own glyphs, so the two headers draw the same icons.
const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.2 5H21l-1.68 8.39c-.16.79-.84 1.36-1.64 1.36H8.07L5.2 5zm0 0L4.27 1H1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Chevron = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BurgerIcon = ({ open }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    {open
      ? <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      : <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
  </svg>
);
BurgerIcon.propTypes = { open: PropTypes.bool.isRequired };

/** Closes on a click outside `ref` or on Escape, returning focus to `returnTo`. */
const useDismiss = (open, setOpen, ref, returnTo) => {
  React.useEffect(() => {
    if (!open) { return undefined; }
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); } };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        if (returnTo.current) { returnTo.current.focus(); }
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen, ref, returnTo]);
};

const SiteHeader = ({
  active,
  showUserMenu,
  myCoursesHref,
  notificationsHref,
  cartHref,
  purchasesHref,
  unreadCount: unreadOverride,
  cartCount: cartOverride,
  onBellClick,
  notificationsDrawer,
}) => {
  const { formatMessage } = useIntl();
  const { authenticatedUser } = React.useContext(AppContext);
  const config = getConfig();
  const signedIn = Boolean(authenticatedUser);

  const [fetchedUnread, setFetchedUnread] = React.useState(0);
  const [fetchedCart, setFetchedCart] = React.useState(0);
  const [authored, setAuthored] = React.useState(0);
  // An app that already knows a count (the learner dashboard has the feed for
  // its drawer) passes it in; the header only fetches what it was not given.
  useLmsCount(signedIn && unreadOverride === undefined, '/api/notifications/', 'unreadCount', setFetchedUnread);
  useLmsCount(signedIn && cartOverride === undefined, '/api/course_cart/', 'itemCount', setFetchedCart);
  useLmsCount(signedIn && showUserMenu, '/api/course-approval/v1/authored/', 'count', setAuthored);
  const unread = unreadOverride === undefined ? fetchedUnread : unreadOverride;
  const cart = cartOverride === undefined ? fetchedCart : cartOverride;

  const [userOpen, setUserOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const bellRef = React.useRef(null);
  const withDrawer = signedIn && notificationsDrawer && !onBellClick;
  const closeDrawer = React.useCallback(() => {
    setDrawerOpen(false);
    if (bellRef.current) { bellRef.current.focus(); }
  }, []);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const userRef = React.useRef(null);
  const userButton = React.useRef(null);
  const headerRef = React.useRef(null);
  const burger = React.useRef(null);
  useDismiss(userOpen, setUserOpen, userRef, userButton);
  useDismiss(mobileOpen, setMobileOpen, headerRef, burger);

  // Quicksand, as on every LMS page. Most MFEs do not load it themselves.
  React.useEffect(() => {
    if (document.getElementById('cs-quicksand')) { return; }
    const link = document.createElement('link');
    link.id = 'cs-quicksand';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  const here = typeof window !== 'undefined' ? window.location.href : '';
  const mainItems = signedIn
    ? [
      { key: 'my-courses', href: myCoursesHref || lms('/dashboard'), label: formatMessage(messages.myCourses) },
      { key: 'discover', href: lms('/courses'), label: formatMessage(messages.discover) },
      { key: 'scale-up', href: lms('/tracking'), label: formatMessage(messages.scaleUp) },
    ]
    : [
      { key: 'discover', href: lms('/courses'), label: formatMessage(messages.courses) },
      { key: 'about', href: lms('/about'), label: formatMessage(messages.about) },
      { key: 'scale-up', href: lms('/tracking'), label: formatMessage(messages.scaleUp) },
      { key: 'profiling', href: lms('/profiling'), label: formatMessage(messages.profiling) },
    ];

  const username = authenticatedUser ? authenticatedUser.username : '';
  const userItems = signedIn ? [
    { href: myCoursesHref || lms('/dashboard'), label: formatMessage(messages.dashboard) },
    { href: `${config.ACCOUNT_PROFILE_URL}/u/${username}`, label: formatMessage(messages.profile) },
    { href: config.ACCOUNT_SETTINGS_URL, label: formatMessage(messages.account) },
    { href: purchasesHref || lms('/purchases'), label: formatMessage(messages.purchases) },
    // No ecommerce "Order history": purchases here are Paymongo cart orders
    // (Purchase history), and some MFEs ship a stock ORDER_HISTORY_URL that
    // would put an entry in their menu the LMS and the dashboard do not have.
    ...(authored > 0 ? [{ href: lms('/my-courses'), label: formatMessage(messages.authored) }] : []),
    // `administrator` is the JWT's name for is_staff.
    ...(authenticatedUser.administrator ? [{ href: lms('/staff'), label: formatMessage(messages.staff) }] : []),
    { href: config.LOGOUT_URL, label: formatMessage(messages.logout) },
  ] : [];

  const handleBell = (event) => {
    // Only a plain click opens an in-page panel; new-tab clicks follow the link.
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (!(onBellClick || withDrawer) || event.button !== 0 || modified) { return; }
    event.preventDefault();
    setMobileOpen(false);
    if (onBellClick) {
      onBellClick(event);
    } else {
      setDrawerOpen((open) => !open);
    }
  };

  const loginQuery = `?next=${encodeURIComponent(here)}`;
  const bellLabel = unread > 0
    ? formatMessage(messages.notificationsCount, { count: unread })
    : formatMessage(messages.notifications);
  const cartLabel = cart > 0
    ? formatMessage(messages.cartCount, { count: cart })
    : formatMessage(messages.cart);

  return (
    <header className={`cs-header${mobileOpen ? ' is-menu-open' : ''}`} ref={headerRef}>
      <a className="cs-header__skip" href="#main">{formatMessage(messages.skip)}</a>
      <div className="cs-header__bar">
        <button
          type="button"
          className="cs-header__burger"
          ref={burger}
          aria-expanded={mobileOpen}
          aria-controls="cs-header-mobile"
          aria-label={formatMessage(mobileOpen ? messages.closeMenu : messages.openMenu)}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <BurgerIcon open={mobileOpen} />
        </button>

        <a className="cs-header__logo" href={lms('/')}>
          <img src={config.LOGO_URL} alt={formatMessage(messages.home)} />
        </a>

        <nav className="cs-header__main" aria-label={formatMessage(messages.mainNav)}>
          {mainItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`cs-header__tab${active === item.key ? ' is-active' : ''}`}
              aria-current={active === item.key ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="cs-header__secondary">
          {signedIn ? (
            <>
              <a
                className="cs-header__icon"
                ref={bellRef}
                href={notificationsHref || lms('/notifications')}
                onClick={handleBell}
                aria-controls={withDrawer ? 'cs-notifications-drawer' : undefined}
                aria-expanded={withDrawer ? drawerOpen : undefined}
                aria-label={bellLabel}
              >
                <BellIcon /><Badge count={unread} />
              </a>
              <a
                className="cs-header__icon"
                href={cartHref || lms('/cart')}
                aria-label={cartLabel}
              >
                <CartIcon /><Badge count={cart} />
              </a>
              {showUserMenu && (
                <div className="cs-header__user" ref={userRef}>
                  <button
                    type="button"
                    className="cs-header__pill"
                    ref={userButton}
                    aria-haspopup="true"
                    aria-expanded={userOpen}
                    aria-controls="cs-header-user-menu"
                    aria-label={`${formatMessage(messages.userMenu)}: ${username}`}
                    onClick={() => setUserOpen((open) => !open)}
                  >
                    <span>{username}</span><Chevron />
                  </button>
                  <div className="cs-header__menu" id="cs-header-user-menu" hidden={!userOpen}>
                    {userItems.map((item) => (
                      <a key={item.label} className="cs-header__menu-item" href={item.href}>{item.label}</a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="cs-header__auth">
              <a className="cs-header__btn cs-header__btn--outline" href={lms(`/register${loginQuery}`)}>
                {formatMessage(messages.register)}
              </a>
              <a className="cs-header__btn" href={lms(`/login${loginQuery}`)}>{formatMessage(messages.signIn)}</a>
            </div>
          )}
        </div>
      </div>

      {/* Below 992px: every link in one list, as the LMS navbar's hamburger does. */}
      <div className="cs-header__mobile" id="cs-header-mobile" hidden={!mobileOpen}>
        {mainItems.map((item) => (
          <a key={item.key} href={item.href} className={`cs-header__mobile-item${active === item.key ? ' is-active' : ''}`}>
            {item.label}
          </a>
        ))}
        {showUserMenu && userItems.map((item) => (
          <a key={item.label} href={item.href} className="cs-header__mobile-item">{item.label}</a>
        ))}
        {!signedIn && (
          <>
            <a href={lms(`/register${loginQuery}`)} className="cs-header__mobile-item">{formatMessage(messages.register)}</a>
            <a href={lms(`/login${loginQuery}`)} className="cs-header__mobile-item">{formatMessage(messages.signIn)}</a>
          </>
        )}
      </div>

      {withDrawer && (
        <NotificationsDrawer
          isOpen={drawerOpen}
          onClose={closeDrawer}
          onUnreadChange={setFetchedUnread}
          seeAllHref={notificationsHref || lms('/notifications')}
        />
      )}
    </header>
  );
};

SiteHeader.propTypes = {
  /** Which main item is the current section: 'my-courses', 'discover', 'scale-up'. */
  active: PropTypes.string,
  /** False on pages reached from an email link that should not offer the account menu. */
  showUserMenu: PropTypes.bool,
  /** Overrides for apps that host these pages themselves (the learner dashboard). */
  myCoursesHref: PropTypes.string,
  notificationsHref: PropTypes.string,
  cartHref: PropTypes.string,
  purchasesHref: PropTypes.string,
  /** Counts an app already has; the header fetches any it is not given. */
  unreadCount: PropTypes.number,
  cartCount: PropTypes.number,
  /** A plain click on the bell calls this instead of following the link. */
  onBellClick: PropTypes.func,
  /**
   * A plain click on the bell opens the shared drawer (NotificationsDrawer)
   * instead of leaving the app. For MFEs without a drawer of their own;
   * ignored when onBellClick is given.
   */
  notificationsDrawer: PropTypes.bool,
};

SiteHeader.defaultProps = {
  active: null,
  showUserMenu: true,
  myCoursesHref: null,
  notificationsHref: null,
  cartHref: null,
  purchasesHref: null,
  unreadCount: undefined,
  cartCount: undefined,
  onBellClick: null,
  notificationsDrawer: false,
};

export default SiteHeader;
