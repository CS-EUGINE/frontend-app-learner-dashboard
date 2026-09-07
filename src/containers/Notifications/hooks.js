import React from 'react';

import { logError } from '@edx/frontend-platform/logging';

import api from 'data/services/lms/api';

/**
 * The bell's data: the feed, the unread count, and marking things read.
 *
 * Fetched once when the header mounts rather than polled. A notification is not
 * a chat message — nothing here is worth a request every thirty seconds on
 * every open tab — and every action that produces one (paying, saving your
 * profile, passing a course) reloads the page anyway.
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const load = React.useCallback(() => {
    let cancelled = false;
    api.fetchNotifications()
      .then(({ data }) => {
        if (cancelled) { return; }
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      })
      // A failed fetch leaves the bell showing no badge rather than an error:
      // it is chrome, not content, and it must never be the loudest thing on
      // a page that otherwise loaded fine.
      .catch((error) => { logError(error); })
      .finally(() => { if (!cancelled) { setIsLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => load(), [load]);

  /**
   * Mark some or all notifications read.
   *
   * The local list is updated from what the server reports rather than
   * optimistically: the count in the badge is the one number here that must
   * not lie, and the round trip is already done by the time anyone looks.
   */
  const markRead = React.useCallback((ids) => {
    const targets = ids === undefined ? null : ids;
    return api.markNotificationsRead(targets ? { ids: targets } : {})
      .then(({ data }) => {
        setUnreadCount(data.unreadCount || 0);
        setNotifications((current) => current.map((notification) => (
          targets === null || targets.includes(notification.id)
            ? { ...notification, isRead: true }
            : notification
        )));
      })
      .catch((error) => { logError(error); });
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    reload: load,
  };
};

export default useNotifications;
