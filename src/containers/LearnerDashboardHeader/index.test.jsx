import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import SiteHeader from 'site-header/SiteHeader';
import LearnerDashboardHeader from '.';
import { isCartPath } from './hooks';

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  // Stubbed out so the header does not reach for the cart API during render.
  useCartItemCount: jest.fn(() => 2),
  isCartPath: jest.fn(() => false),
  isPurchasesPath: jest.fn(() => false),
}));
jest.mock('containers/Notifications/hooks', () => ({
  useNotifications: () => ({ notifications: [], unreadCount: 3, markRead: jest.fn() }),
}));
jest.mock('containers/MasqueradeBar', () => 'MasqueradeBar');
jest.mock('containers/Notifications/NotificationsPanel', () => 'NotificationsPanel');
jest.mock('./ConfirmEmailBanner', () => 'ConfirmEmailBanner');
jest.mock('site-header/SiteHeader', () => 'SiteHeader');

const headerProps = (wrapper) => wrapper.instance.findByType(SiteHeader)[0].props;

describe('LearnerDashboardHeader', () => {
  // setupTest stubs React.useState with a bare jest.fn(); the drawer's open
  // state needs a real [value, setter] pair to render at all.
  beforeEach(() => {
    React.useState.mockImplementation((initial) => [initial, jest.fn()]);
  });

  test('renders the shared site header with the banner, drawer and masquerade bar', () => {
    const wrapper = shallow(<LearnerDashboardHeader />);
    expect(wrapper.instance.findByType(SiteHeader)).toHaveLength(1);
    expect(wrapper.instance.findByType('ConfirmEmailBanner')).toHaveLength(1);
    expect(wrapper.instance.findByType('NotificationsPanel')).toHaveLength(1);
    expect(wrapper.instance.findByType('MasqueradeBar')).toHaveLength(1);
  });

  test('links to its own routes inside the router basename', () => {
    const props = headerProps(shallow(<LearnerDashboardHeader />));
    expect(props.myCoursesHref).not.toEqual('/');
    expect(props.cartHref.endsWith('/cart') || props.cartHref.endsWith('cart')).toBe(true);
    expect(props.notificationsHref.endsWith('notifications')).toBe(true);
    expect(props.purchasesHref.endsWith('purchases')).toBe(true);
  });

  test('hands the header the counts it already has', () => {
    const props = headerProps(shallow(<LearnerDashboardHeader />));
    expect(props.unreadCount).toEqual(3);
    expect(props.cartCount).toEqual(2);
    expect(typeof props.onBellClick).toBe('function');
  });

  test('My courses is the active item on the dashboard, and not on the cart', () => {
    expect(headerProps(shallow(<LearnerDashboardHeader />)).active).toEqual('my-courses');
    isCartPath.mockReturnValueOnce(true);
    expect(headerProps(shallow(<LearnerDashboardHeader />)).active).toBeNull();
  });
});
