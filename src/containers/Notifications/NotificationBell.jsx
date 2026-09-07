import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@openedx/paragon';
import { Notifications, NotificationsNone } from '@openedx/paragon/icons';

/**
 * The bell in the header's secondary menu, with an unread badge.
 *
 * Mirrors CartNavIcon next to it: the packaged Header renders whatever JSX an
 * item's `content` is, so a nav icon is a plain component rather than anything
 * the header has to know about.
 *
 * The filled bell is used only when something is unread, so the icon itself
 * carries the state as well as the badge — a colour-and-number-only cue is
 * invisible to anyone who cannot see the badge.
 */
export const NotificationBell = ({ count, label }) => (
  <span className="notification-bell" aria-label={label} role="img">
    <Icon src={count > 0 ? Notifications : NotificationsNone} />
    {count > 0 && (
      <span className="notification-bell__badge" aria-hidden="true">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </span>
);

NotificationBell.propTypes = {
  count: PropTypes.number,
  label: PropTypes.string.isRequired,
};

NotificationBell.defaultProps = {
  count: 0,
};

export default NotificationBell;
