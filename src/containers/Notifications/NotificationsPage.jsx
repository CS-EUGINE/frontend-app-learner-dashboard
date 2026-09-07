import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Container } from '@openedx/paragon';

import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';
import NotificationItem from './NotificationItem';
import { useNotifications } from './hooks';
import messages from './messages';

import './index.scss';

/**
 * The whole feed, for when the panel's eight are not enough.
 *
 * Fetches its own copy rather than sharing the header's: this is a separate
 * route, so the header above it has just mounted and fetched too. One extra
 * request on a page someone reaches deliberately is cheaper than hoisting this
 * state into redux for every page that does not need it.
 */
export const NotificationsPage = () => {
  const { formatMessage } = useIntl();
  const {
    notifications, unreadCount, isLoading, markRead,
  } = useNotifications();

  return (
    <div className="notifications-page">
      <LearnerDashboardHeader />
      <Container size="md" className="py-4.5">
        <div className="notifications-page__header">
          <h1 className="notifications-page__title">{formatMessage(messages.pageTitle)}</h1>
          {unreadCount > 0 && (
            <Button variant="outline-primary" size="sm" onClick={() => markRead()}>
              {formatMessage(messages.markAllRead)}
            </Button>
          )}
        </div>

        {!isLoading && notifications.length === 0 && (
          <div className="notifications-page__empty">
            <p className="notifications-page__empty-title">{formatMessage(messages.empty)}</p>
            <p className="notifications-page__empty-hint">{formatMessage(messages.emptyHint)}</p>
          </div>
        )}

        <div className="notifications-page__list">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onActivate={(id) => markRead([id])}
            />
          ))}
        </div>

        <a className="notifications-page__back" href={getConfig().PUBLIC_PATH}>
          {formatMessage(messages.backToDashboard)}
        </a>
      </Container>
    </div>
  );
};

export default NotificationsPage;
