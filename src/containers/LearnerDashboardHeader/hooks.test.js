import { useWindowSize, breakpoints } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import track from 'tracking';
import { linkNames } from 'tracking/constants';

import { MockUseState } from 'testUtils';

import * as hooks from './hooks';

const state = new MockUseState(hooks);

const {
  useIsCollapsed,
  findCoursesNavClicked,
  findCoursesNavDropdownClicked,
  useLearnerDashboardHeaderData,
  useLearnerDashboardHeaderMenu,
} = hooks;

jest.mock('tracking', () => ({
  findCourses: {
    findCoursesClicked: jest.fn(),
  },
}));

const url = 'http://example.com';

describe('LearnerDashboardHeader hooks', () => {
  describe('state values', () => {
    state.testGetter(state.keys.isOpen);
  });

  describe('useIsCollapsed', () => {
    test('large screen is not collapsed', () => {
      useWindowSize.mockReturnValueOnce({ width: breakpoints.large.minWidth + 1 });
      expect(useIsCollapsed()).toEqual(false);
    });
    test('small screen is collapsed', () => {
      useWindowSize.mockReturnValueOnce({ width: breakpoints.large.minWidth - 1 });
      expect(useIsCollapsed()).toEqual(true);
    });
  });

  describe('findCoursesNavClicked', () => {
    test('calls tracking with nav link name', () => {
      findCoursesNavClicked(url);
      expect(track.findCourses.findCoursesClicked).toHaveBeenCalledWith(url, {
        linkName: linkNames.learnerHomeNavExplore,
      });
    });
  });

  describe('getLearnerDashboardHeaderMenu', () => {
    const courseSearchUrl = '/courses';
    const authenticatedUser = { username: 'test' };

    const cartItemOf = (menu) => menu.secondaryMenu.find(item => item.href.endsWith('/cart'));

    test('calls header menu data hook', () => {
      const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({ courseSearchUrl, authenticatedUser });
      // Courses and Discover New; the cart lives in the secondary menu.
      expect(learnerHomeHeaderMenu.mainMenu.length).toBe(2);
    });
    test('cart icon sits in the right-hand secondary menu', () => {
      const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({ courseSearchUrl, authenticatedUser });
      expect(cartItemOf(learnerHomeHeaderMenu)).toBeDefined();
    });
    test('cart icon carries no count when the cart is empty', () => {
      const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({ courseSearchUrl, authenticatedUser });
      const { count, label } = cartItemOf(learnerHomeHeaderMenu).content.props;
      expect(count).toEqual(0);
      expect(label).toEqual('Cart');
    });
    test('Courses is active on the dashboard, cart is not', () => {
      const menu = useLearnerDashboardHeaderMenu({ courseSearchUrl, authenticatedUser });
      expect(menu.mainMenu[0].isActive).toBe(true);
      expect(cartItemOf(menu).isActive).toBe(false);
    });
    test('cart is active on the cart page, Courses is not', () => {
      const menu = useLearnerDashboardHeaderMenu({
        courseSearchUrl, authenticatedUser, isCartPage: true,
      });
      expect(menu.mainMenu[0].isActive).toBe(false);
      expect(cartItemOf(menu).isActive).toBe(true);
    });
    test('Courses links inside the router basename, not the origin root', () => {
      const menu = useLearnerDashboardHeaderMenu({ courseSearchUrl, authenticatedUser });
      expect(menu.mainMenu[0].href).not.toEqual('/');
      expect(menu.mainMenu[0].href).toEqual(getConfig().PUBLIC_PATH);
    });
    test('cart icon carries the item count when the cart is not empty', () => {
      const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
        courseSearchUrl, authenticatedUser, cartItemCount: 2,
      });
      const { count, label } = cartItemOf(learnerHomeHeaderMenu).content.props;
      expect(count).toEqual(2);
      expect(label).toEqual('Cart (2)');
    });
  });

  describe('findCoursesNavDropdownClicked', () => {
    test('calls tracking with dropdown link name', () => {
      findCoursesNavDropdownClicked(url);
      expect(track.findCourses.findCoursesClicked).toHaveBeenCalledWith(url, {
        linkName: linkNames.learnerHomeNavDropdownExplore,
      });
    });
  });

  describe('useLearnerDashboardHeaderData', () => {
    test('default state', () => {
      state.mock();
      const out = useLearnerDashboardHeaderData();
      state.expectInitializedWith(state.keys.isOpen, false);
      out.toggleIsOpen();
      expect(state.values.isOpen).toEqual(true);
    });
  });
});
