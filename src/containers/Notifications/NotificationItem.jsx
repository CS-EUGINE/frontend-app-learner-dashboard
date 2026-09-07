import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import {
  Article,
  Campaign,
  CheckCircle,
  Lock,
  Payment,
  Person,
  School,
} from '@openedx/paragon/icons';

import messages from './messages';

// One icon per kind, so the feed is scannable without reading every line.
// Falls back rather than throwing on a kind the server adds later.
const KIND_ICONS = {
  payment_successful: Payment,
  course_completed: School,
  certificate_ready: CheckCircle,
  new_course: School,
  latest_news: Article,
  announcement: Campaign,
  account_updated: Lock,
  password_updated: Lock,
  profile_updated: Person,
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "3m ago" while that is the useful answer, a date once it is not.
 *
 * Deliberately not a live-updating relative time: the feed is fetched once, and
 * a timestamp that ticks while nothing else on the page changes is a
 * distraction in a dropdown someone opened for two seconds.
 */
export const useTimeLabel = () => {
  const { formatMessage, formatDate } = useIntl();
  return (isoDate) => {
    const elapsed = Date.now() - new Date(isoDate).getTime();
    if (elapsed < MINUTE) { return formatMessage(messages.justNow); }
    if (elapsed < HOUR) {
      return formatMessage(messages.minutesAgo, { count: Math.floor(elapsed / MINUTE) });
    }
    if (elapsed < DAY) {
      return formatMessage(messages.hoursAgo, { count: Math.floor(elapsed / HOUR) });
    }
    return formatDate(isoDate);
  };
};

export const NotificationItem = ({ notification, onActivate }) => {
  const { formatMessage } = useIntl();
  const timeLabel = useTimeLabel();

  const {
    id, kind, title, body, linkUrl, isRead, isSecurity, created,
  } = notification;

  // Clicking marks it read and then follows the link, if there is one. The mark
  // is fire-and-forget: a learner who clicked through to their certificate
  // should not be held up by, or told about, a bookkeeping request.
  const handleClick = () => { onActivate(id); };

  const content = (
    <>
      <span className={classNames('notification-item__icon', { 'notification-item__icon--security': isSecurity })}>
        <Icon src={KIND_ICONS[kind] || Article} screenReaderText="" />
      </span>
      <span className="notification-item__text">
        <span className="notification-item__title">{title}</span>
        {body && <span className="notification-item__body">{body}</span>}
        <span className="notification-item__time">{timeLabel(created)}</span>
      </span>
      {!isRead && (
        <span className="notification-item__dot" title={formatMessage(messages.unreadDot)}>
          <span className="sr-only">{formatMessage(messages.unreadDot)}</span>
        </span>
      )}
    </>
  );

  const className = classNames('notification-item', { 'notification-item--unread': !isRead });

  // A notification with somewhere to go is a link; one without is not, rather
  // than a link to nowhere that looks identical.
  return linkUrl
    ? <a className={className} href={linkUrl} onClick={handleClick}>{content}</a>
    : (
      <button type="button" className={className} onClick={handleClick}>
        {content}
      </button>
    );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    kind: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    linkUrl: PropTypes.string,
    isRead: PropTypes.bool,
    isSecurity: PropTypes.bool,
    created: PropTypes.string.isRequired,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default NotificationItem;
