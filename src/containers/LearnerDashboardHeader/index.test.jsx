import { mergeConfig } from '@edx/frontend-platform';
import { shallow } from '@edx/react-unit-test-utils';
import Header from '@edx/frontend-component-header';

import urls from 'data/services/lms/urls';
import LearnerDashboardHeader from '.';
import { findCoursesNavClicked } from './hooks';

jest.mock('hooks', () => ({
  reduxHooks: {
    usePlatformSettingsData: jest.fn(() => ({
      courseSearchUrl: '/course-search-url',
    })),
  },
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  findCoursesNavClicked: jest.fn(),
  // Stubbed out so the header does not reach for the cart API during render.
  useCartItemCount: jest.fn(() => 0),
}));
jest.mock('containers/MasqueradeBar', () => 'MasqueradeBar');
jest.mock('./ConfirmEmailBanner', () => 'ConfirmEmailBanner');
jest.mock('@edx/frontend-component-header', () => 'Header');

describe('LearnerDashboardHeader', () => {
  test('render', () => {
    mergeConfig({ ORDER_HISTORY_URL: 'test-url' });
    const wrapper = shallow(<LearnerDashboardHeader />);
    expect(wrapper.snapshot).toMatchSnapshot();
    expect(wrapper.instance.findByType('ConfirmEmailBanner')).toHaveLength(1);
    expect(wrapper.instance.findByType('MasqueradeBar')).toHaveLength(1);
    expect(wrapper.instance.findByType(Header)).toHaveLength(1);
    wrapper.instance.findByType(Header)[0].props.mainMenuItems[1].onClick();
    expect(findCoursesNavClicked).toHaveBeenCalledWith(urls.baseAppUrl('/course-search-url'));
    // Only the cart icon, which lives in the right-hand secondary menu.
    expect(wrapper.instance.findByType(Header)[0].props.secondaryMenuItems.length).toBe(1);
  });

  test('should display Help link if SUPPORT_URL is set', () => {
    mergeConfig({ SUPPORT_URL: 'http://localhost:18000/support' });
    const wrapper = shallow(<LearnerDashboardHeader />);
    // Help plus the cart icon.
    expect(wrapper.instance.findByType(Header)[0].props.secondaryMenuItems.length).toBe(2);
  });
  test('should display Programs link if it is enabled by configuration', () => {
    mergeConfig({ ENABLE_PROGRAMS: true });
    const wrapper = shallow(<LearnerDashboardHeader />);
    // Courses, Programs, and Discover New.
    expect(wrapper.instance.findByType(Header)[0].props.mainMenuItems.length).toBe(3);
  });
  test('should link to the cart page from the secondary menu', () => {
    const wrapper = shallow(<LearnerDashboardHeader />);
    const { secondaryMenuItems } = wrapper.instance.findByType(Header)[0].props;
    expect(secondaryMenuItems.some(item => item.href.endsWith('/cart'))).toBe(true);
  });
});
