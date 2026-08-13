import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { AppContext } from '@edx/frontend-platform/react';
import Header from '@edx/frontend-component-header';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import {
  useLearnerDashboardHeaderMenu,
  useCartItemCount,
  findCoursesNavClicked,
  isCartPath,
  DEFAULT_COURSE_SEARCH_URL,
} from './hooks';

import './index.scss';

export const LearnerDashboardHeader = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const platformSettings = reduxHooks.usePlatformSettingsData();

  // Pages other than the dashboard (the cart, for one) never populate the redux
  // store, so platform settings can be empty here. Without a default the Discover
  // New link resolves to the string "undefined".
  const courseSearchUrl = platformSettings.courseSearchUrl || DEFAULT_COURSE_SEARCH_URL;

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const cartItemCount = useCartItemCount();

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
    cartItemCount,
    isCartPage: isCartPath(),
  });

  return (
    <>
      <ConfirmEmailBanner />
      <Header
        mainMenuItems={learnerHomeHeaderMenu.mainMenu}
        secondaryMenuItems={learnerHomeHeaderMenu.secondaryMenu}
        userMenuItems={learnerHomeHeaderMenu.userMenu}
      />
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
