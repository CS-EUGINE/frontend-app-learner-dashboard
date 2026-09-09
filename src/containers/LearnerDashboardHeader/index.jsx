import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { AppContext } from '@edx/frontend-platform/react';
import Header from '@edx/frontend-component-header';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';

import NotificationsPanel from 'containers/Notifications/NotificationsPanel';
import { useNotifications } from 'containers/Notifications/hooks';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import {
  useLearnerDashboardHeaderMenu,
  useCartItemCount,
  useAuthoredCourseCount,
  findCoursesNavClicked,
  isCartPath,
  isPurchasesPath,
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
  const authoredCourseCount = useAuthoredCourseCount();

  // The bell's state lives here, not in the menu item, because the drawer is
  // rendered outside <Header>: it owns the right-hand edge of the window rather
  // than hanging off the bell, so the packaged header cannot clip or displace it.
  const {
    notifications, unreadCount, markRead,
  } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
    cartItemCount,
    isCartPage: isCartPath(),
    isPurchasesPage: isPurchasesPath(),
    authoredCourseCount,
    notifications: {
      unreadCount,
      // A plain click opens the panel; anything else (middle-click, ctrl-click,
      // Enter on the link) is left alone and follows the href to the full page.
      onBellClick: (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button > 0) { return; }
        event.preventDefault();
        setIsPanelOpen((open) => !open);
      },
    },
  });

  return (
    <>
      <ConfirmEmailBanner />
      <Header
        mainMenuItems={learnerHomeHeaderMenu.mainMenu}
        secondaryMenuItems={learnerHomeHeaderMenu.secondaryMenu}
        userMenuItems={learnerHomeHeaderMenu.userMenu}
      />
      <NotificationsPanel
        notifications={notifications}
        unreadCount={unreadCount}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onMarkAllRead={() => markRead()}
        onActivate={(id) => markRead([id])}
      />
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
