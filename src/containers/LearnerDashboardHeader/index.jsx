import React from 'react';

import { getConfig } from '@edx/frontend-platform';

import MasqueradeBar from 'containers/MasqueradeBar';
import SiteHeader from 'site-header/SiteHeader';

import NotificationsPanel from 'containers/Notifications/NotificationsPanel';
import { useNotifications } from 'containers/Notifications/hooks';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import { useCartItemCount, isCartPath, isPurchasesPath } from './hooks';

import './index.scss';

/**
 * The learner dashboard's header: the shared site header (src/site-header,
 * the same component every MFE renders, matching the LMS navbar), plus what
 * only this app has around it: the email-confirmation banner, the
 * notifications drawer and the masquerade bar.
 *
 * The dashboard hosts My courses, the cart, purchases and notifications
 * itself, so it passes its own routes rather than the LMS redirects the other
 * MFEs use. PUBLIC_PATH, not '/': the router basename is /learner-dashboard/,
 * and a bare '/' would land at the origin root and render a blank page.
 */
export const LearnerDashboardHeader = () => {
  const base = getConfig().PUBLIC_PATH;
  const cartItemCount = useCartItemCount();

  // The drawer is rendered outside the header: it owns the right-hand edge of
  // the window rather than hanging off the bell, so nothing can clip it. Its
  // feed also gives the header its unread count, so that is not fetched twice.
  const { notifications, unreadCount, markRead } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const onOwnPage = isCartPath() || isPurchasesPath();

  return (
    <>
      <ConfirmEmailBanner />
      <SiteHeader
        active={onOwnPage ? null : 'my-courses'}
        myCoursesHref={base}
        notificationsHref={`${base}notifications`}
        cartHref={`${base}cart`}
        purchasesHref={`${base}purchases`}
        unreadCount={unreadCount}
        cartCount={cartItemCount}
        onBellClick={() => setIsPanelOpen((open) => !open)}
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
