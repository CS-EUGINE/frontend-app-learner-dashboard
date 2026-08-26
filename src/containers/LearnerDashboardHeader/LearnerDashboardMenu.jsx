import React from 'react';

import { getConfig } from '@edx/frontend-platform';

import urls from 'data/services/lms/urls';

import CartNavIcon from './CartNavIcon';
import messages from './messages';

const getLearnerHeaderMenu = (
  formatMessage,
  courseSearchUrl,
  authenticatedUser,
  exploreCoursesClick,
  cartItemCount = 0,
  isCartPage = false,
  authoredCourseCount = 0,
) => ({
  mainMenu: [
    {
      type: 'item',
      // PUBLIC_PATH, not '/': the router basename is /learner-dashboard/, so a
      // bare '/' lands at the origin root and renders a blank page.
      href: getConfig().PUBLIC_PATH,
      content: formatMessage(messages.course),
      isActive: !isCartPage,
    },
    ...(getConfig().ENABLE_PROGRAMS ? [{
      type: 'item',
      href: `${urls.programsUrl()}`,
      content: formatMessage(messages.program),
    }] : []),
    {
      type: 'item',
      href: `${urls.baseAppUrl(courseSearchUrl)}`,
      content: formatMessage(messages.discoverNew),
      onClick: (e) => {
        exploreCoursesClick(e);
      },
    },
  ],
  secondaryMenu: [
    ...(getConfig().SUPPORT_URL ? [{
      type: 'item',
      href: `${getConfig().SUPPORT_URL}`,
      content: formatMessage(messages.help),
    }] : []),
    {
      type: 'item',
      // Prefixed with PUBLIC_PATH so the link lands inside the router basename
      // (e.g. /learner-dashboard/cart) rather than at the bare origin root.
      href: `${getConfig().PUBLIC_PATH}cart`,
      isActive: isCartPage,
      content: (
        <CartNavIcon
          count={cartItemCount}
          label={cartItemCount > 0
            ? formatMessage(messages.cartWithCount, { count: cartItemCount })
            : formatMessage(messages.cart)}
        />
      ),
    },
  ],
  userMenu: [
    {
      heading: '',
      items: [
        // Mirrors the LMS navbar dropdown, which leads with Dashboard. Uses
        // PUBLIC_PATH for the same reason as the main menu: a bare '/' would
        // leave the router basename and render a blank page.
        {
          type: 'item',
          href: getConfig().PUBLIC_PATH,
          content: formatMessage(messages.dashboard),
        },
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser?.username}`,
          content: formatMessage(messages.profile),
        },
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_SETTINGS_URL}`,
          content: formatMessage(messages.account),
        },
        ...(getConfig().ORDER_HISTORY_URL ? [{
          type: 'item',
          href: getConfig().ORDER_HISTORY_URL,
          content: formatMessage(messages.orderHistory),
        }] : []),
        // Course authors only. This page lives in the LMS, not in this MFE, so
        // it needs baseAppUrl rather than the router basename.
        ...(authoredCourseCount > 0 ? [{
          type: 'item',
          href: urls.baseAppUrl('/my-courses'),
          content: formatMessage(messages.myCourses),
        }] : []),
      ],
    },
    // Staff and admins move between the two dashboards all day, and from here
    // the only way back to /staff was the address bar. Its own group so it
    // reads as a tool rather than another personal link, and it lives in the
    // LMS, so baseAppUrl rather than the router basename. `administrator` is
    // the JWT's spelling of `is_staff`.
    ...(authenticatedUser?.administrator ? [{
      heading: '',
      items: [
        {
          type: 'item',
          href: urls.baseAppUrl('/staff'),
          content: formatMessage(messages.staffDashboard),
        },
      ],
    }] : []),
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${getConfig().LOGOUT_URL}`,
          content: formatMessage(messages.signOut),
        },
      ],
    },
  ],
}
);

export default getLearnerHeaderMenu;
