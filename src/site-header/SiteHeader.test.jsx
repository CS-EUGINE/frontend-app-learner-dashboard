/* eslint-disable import/first, import/no-extraneous-dependencies */
// Real React: setupTest stubs its hooks, and this component is all hooks.
// Not copied to the other MFEs with SiteHeader.jsx/.scss; their test setups
// differ, and this one covers the shared behaviour.
jest.unmock('react');

import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import SiteHeader from './SiteHeader';

jest.mock('@edx/frontend-platform/auth', () => ({ getAuthenticatedHttpClient: jest.fn() }));

const LMS = 'http://lms.test';
const FEED = [
  {
    id: 7, kind: 'payment_successful', title: 'Payment successful', body: 'You paid ₱1,500.', linkUrl: '/dashboard', isRead: false, isSecurity: false, created: new Date().toISOString(),
  },
  {
    id: 8, kind: 'password_updated', title: 'Your password was changed', body: '', linkUrl: '', isRead: true, isSecurity: true, created: new Date().toISOString(),
  },
];
const COUNTS = {
  '/api/notifications/': { unreadCount: 4, notifications: FEED },
  '/api/course_cart/': { itemCount: 2 },
  '/api/course-approval/v1/authored/': { count: 1 },
};

const renderHeader = (user, props = {}) => render(
  <IntlProvider locale="en">
    <AppContext.Provider value={{ authenticatedUser: user }}>
      <SiteHeader {...props} />
    </AppContext.Provider>
  </IntlProvider>,
);

const learner = { username: 'ana', administrator: false };

describe('SiteHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mergeConfig({
      LMS_BASE_URL: LMS,
      LOGO_URL: `${LMS}/logo.png`,
      LOGOUT_URL: `${LMS}/logout`,
      ACCOUNT_PROFILE_URL: 'http://apps.test/profile',
      ACCOUNT_SETTINGS_URL: 'http://apps.test/account/',
    });
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn((url) => Promise.resolve({ data: COUNTS[url.replace(LMS, '')] || {} })),
      post: jest.fn(() => Promise.resolve({ data: { updated: 1, unreadCount: 0 } })),
    });
  });

  it('shows the signed-in main menu, with the active item marked', () => {
    renderHeader(learner, { active: 'discover' });
    const labels = screen.getAllByRole('link').map((a) => a.textContent);
    expect(labels).toEqual(expect.arrayContaining(['My courses', 'Discover', 'Scale-Up']));
    expect(screen.getByText('Discover', { selector: '.cs-header__tab' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('My courses', { selector: '.cs-header__tab' })).toHaveAttribute('href', `${LMS}/dashboard`);
  });

  it('fetches the bell, cart and authored counts it was not given', async () => {
    renderHeader(learner);
    expect(await screen.findByLabelText('Notifications, 4 unread')).toBeInTheDocument();
    expect(screen.getByLabelText('Shopping cart, 2 courses')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Account menu/ }));
    expect(await screen.findByText('Authored courses', { selector: '.cs-header__menu-item' })).toBeInTheDocument();
  });

  it('uses counts passed in instead of fetching them', async () => {
    renderHeader(learner, { unreadCount: 9, cartCount: 0 });
    expect(screen.getByLabelText('Notifications, 9 unread')).toBeInTheDocument();
    expect(screen.getByLabelText('Shopping cart')).toBeInTheDocument();
    await waitFor(() => expect(getAuthenticatedHttpClient().get).toHaveBeenCalledTimes(1));
    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(`${LMS}/api/course-approval/v1/authored/`);
  });

  it('lists the LMS dropdown entries in its order, plus Staff dashboard for staff', () => {
    renderHeader({ username: 'boss', administrator: true }, { unreadCount: 0, cartCount: 0 });
    fireEvent.click(screen.getByRole('button', { name: /Account menu/ }));
    const items = [...document.querySelectorAll('.cs-header__menu-item')].map((a) => a.textContent);
    expect(items).toEqual(['Dashboard', 'Profile', 'Account', 'Purchase history', 'Staff dashboard', 'Logout']);
    expect(screen.getByText('Profile', { selector: '.cs-header__menu-item' })).toHaveAttribute('href', 'http://apps.test/profile/u/boss');
  });

  it('opens and closes the user menu, and Escape closes it', () => {
    renderHeader(learner, { unreadCount: 0, cartCount: 0 });
    const button = screen.getByRole('button', { name: /Account menu/ });
    const menu = document.getElementById('cs-header-user-menu');
    expect(menu).not.toBeVisible();
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the drawer on a plain bell click but lets ctrl-click follow the link', () => {
    const onBellClick = jest.fn();
    renderHeader(learner, { unreadCount: 1, cartCount: 0, onBellClick });
    const bell = screen.getByLabelText('Notifications, 1 unread');
    fireEvent.click(bell, { button: 0, ctrlKey: true });
    expect(onBellClick).not.toHaveBeenCalled();
    fireEvent.click(bell, { button: 0 });
    expect(onBellClick).toHaveBeenCalledTimes(1);
  });

  it('shows the signed-out menu and sign-in buttons without a user', () => {
    renderHeader(null);
    expect(screen.getByText('Courses', { selector: '.cs-header__tab' })).toBeInTheDocument();
    expect(screen.getByText('Profiling', { selector: '.cs-header__tab' })).toBeInTheDocument();
    expect(screen.getByText('Sign in', { selector: '.cs-header__btn' }).getAttribute('href')).toMatch(`${LMS}/login?next=`);
    expect(screen.queryByLabelText(/Notifications/)).toBeNull();
    expect(getAuthenticatedHttpClient).not.toHaveBeenCalled();
  });

  it('hides the account menu when asked to', () => {
    renderHeader(learner, { showUserMenu: false, unreadCount: 0, cartCount: 0 });
    expect(screen.queryByRole('button', { name: /Account menu/ })).toBeNull();
  });

  it('toggles the hamburger list', () => {
    renderHeader(learner, { unreadCount: 0, cartCount: 0 });
    const burger = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(burger);
    expect(document.getElementById('cs-header-mobile')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  });

  describe('with notificationsDrawer', () => {
    it('opens the drawer on a plain bell click and shows the feed', async () => {
      renderHeader(learner, { notificationsDrawer: true });
      const bell = await screen.findByLabelText('Notifications, 4 unread');
      expect(bell).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(bell, { button: 0 });
      expect(bell).toHaveAttribute('aria-expanded', 'true');
      expect(document.getElementById('cs-notifications-drawer')).toHaveClass('is-open');
      expect(await screen.findByText('Payment successful')).toBeInTheDocument();
      expect(screen.getByText('Payment successful').closest('a')).toHaveAttribute('href', '/dashboard');
      expect(screen.getByText('See all notifications')).toHaveAttribute('href', `${LMS}/notifications`);
    });

    it('lets a ctrl-click follow the link instead', async () => {
      renderHeader(learner, { notificationsDrawer: true });
      const bell = await screen.findByLabelText('Notifications, 4 unread');
      fireEvent.click(bell, { button: 0, ctrlKey: true });
      expect(bell).toHaveAttribute('aria-expanded', 'false');
    });

    it('marks everything read and clears the badge', async () => {
      renderHeader(learner, { notificationsDrawer: true });
      fireEvent.click(await screen.findByLabelText('Notifications, 4 unread'), { button: 0 });
      fireEvent.click(await screen.findByText('Mark all read'));
      await waitFor(() => expect(screen.getByLabelText('Notifications')).toBeInTheDocument());
      expect(getAuthenticatedHttpClient().post).toHaveBeenCalledWith(`${LMS}/api/notifications/read/`, {});
      expect(document.querySelector('.cs-notif-item.is-unread')).toBeNull();
    });

    it('closes on Escape', async () => {
      renderHeader(learner, { notificationsDrawer: true });
      const bell = await screen.findByLabelText('Notifications, 4 unread');
      fireEvent.click(bell, { button: 0 });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(bell).toHaveAttribute('aria-expanded', 'false');
    });

    it('is not rendered without the prop', () => {
      renderHeader(learner, { unreadCount: 0, cartCount: 0 });
      expect(document.getElementById('cs-notifications-drawer')).toBeNull();
    });
  });
});
