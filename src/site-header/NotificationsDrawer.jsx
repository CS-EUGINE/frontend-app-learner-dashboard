/**
 * The notifications drawer, for MFEs that do not have one of their own.
 *
 * Part of src/site-header: identical in the learner-dashboard, account,
 * profile and learning forks (see SiteHeader.jsx). SiteHeader renders it when
 * given `notificationsDrawer`; account and profile turn that on. The learner
 * dashboard keeps its own drawer (containers/Notifications), which this copies:
 * same geometry (a fixed aside 40% wide, min 320px, full width under 768px,
 * 260ms slide, navy-black backdrop at 50%), same icons per kind, same
 * behaviour (Escape and a backdrop click close it, a row is marked read when
 * clicked, "Mark all read", the recent feed with "See all" to the full page).
 *
 * It is a portal on <body>, not a child of the sticky header, so it owns the
 * right-hand edge of the window and nothing in the header can clip it.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { defineMessages, useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import {
  Article, Campaign, CheckCircle, Close, Lock, Payment, Person, School,
} from '@openedx/paragon/icons';

import './NotificationsDrawer.scss';

const messages = defineMessages({
  heading: { id: 'site-header.drawer.heading', defaultMessage: 'Notifications' },
  markAllRead: { id: 'site-header.drawer.mark-all-read', defaultMessage: 'Mark all read' },
  close: { id: 'site-header.drawer.close', defaultMessage: 'Close notifications' },
  seeAll: { id: 'site-header.drawer.see-all', defaultMessage: 'See all notifications' },
  loading: { id: 'site-header.drawer.loading', defaultMessage: 'Loading notifications…' },
  error: { id: 'site-header.drawer.error', defaultMessage: "Couldn't load notifications." },
  retry: { id: 'site-header.drawer.retry', defaultMessage: 'Try again' },
  empty: { id: 'site-header.drawer.empty', defaultMessage: 'Nothing yet.' },
  emptyHint: {
    id: 'site-header.drawer.empty-hint',
    defaultMessage: 'Payments, certificates and course updates will show up here.',
  },
  unread: { id: 'site-header.drawer.unread', defaultMessage: 'Unread' },
  justNow: { id: 'site-header.drawer.just-now', defaultMessage: 'just now' },
  minutesAgo: { id: 'site-header.drawer.minutes-ago', defaultMessage: '{count}m ago' },
  hoursAgo: { id: 'site-header.drawer.hours-ago', defaultMessage: '{count}h ago' },
});

// The drawer is the recent feed, not the archive; the rest is behind "See all".
export const PANEL_SIZE = 8;

// One icon per kind, as in the learner dashboard's drawer. Falls back rather
// than throwing on a kind the server adds later.
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

const lms = (path) => `${getConfig().LMS_BASE_URL}${path}`;

// Only site-relative or http(s) links are followed; anything else is a plain row.
const safeLink = (url) => (url && /^(https?:\/\/|\/(?!\/))/i.test(url) ? url : '');

const NotificationsDrawer = ({
  isOpen, onClose, onUnreadChange, seeAllHref,
}) => {
  const { formatMessage, formatDate } = useIntl();
  const [items, setItems] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const drawerRef = React.useRef(null);

  const load = React.useCallback(() => {
    setStatus('loading');
    try {
      getAuthenticatedHttpClient().get(lms('/api/notifications/'))
        .then(({ data }) => {
          setItems(data.notifications || []);
          onUnreadChange(data.unreadCount || 0);
          setStatus('ready');
        })
        .catch(() => setStatus('error'));
    } catch (e) {
      setStatus('error');
    }
  }, [onUnreadChange]);

  // Fetched on every open, so a drawer opened late in a session is current.
  React.useEffect(() => { if (isOpen) { load(); } }, [isOpen, load]);

  React.useEffect(() => {
    if (!isOpen) { return undefined; }
    const onKeyDown = (event) => { if (event.key === 'Escape') { onClose(); } };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Focus moves into the drawer on open, so the next Tab is inside it.
  React.useEffect(() => {
    if (isOpen && drawerRef.current) { drawerRef.current.focus(); }
  }, [isOpen]);

  // ids: a list, or null for everything. The badge takes the server's count
  // afterwards: it is the one number here that must not lie.
  const markRead = (ids) => {
    try {
      return getAuthenticatedHttpClient()
        .post(lms('/api/notifications/read/'), ids ? { ids } : {})
        .then(({ data }) => {
          onUnreadChange(data.unreadCount || 0);
          setItems((current) => current.map((n) => (!ids || ids.includes(n.id) ? { ...n, isRead: true } : n)));
        })
        .catch(() => {});
    } catch (e) {
      return Promise.resolve();
    }
  };

  const timeLabel = (iso) => {
    const elapsed = Date.now() - new Date(iso).getTime();
    if (elapsed < MINUTE) { return formatMessage(messages.justNow); }
    if (elapsed < HOUR) { return formatMessage(messages.minutesAgo, { count: Math.floor(elapsed / MINUTE) }); }
    if (elapsed < DAY) { return formatMessage(messages.hoursAgo, { count: Math.floor(elapsed / HOUR) }); }
    return formatDate(iso);
  };

  const unreadCount = items.filter((n) => !n.isRead).length;
  const shown = items.slice(0, PANEL_SIZE);

  const renderItem = (n) => {
    const href = safeLink(n.linkUrl);
    const content = (
      <>
        <span className={`cs-notif-item__icon${n.isSecurity ? ' is-security' : ''}`}>
          <Icon src={KIND_ICONS[n.kind] || Article} />
        </span>
        <span className="cs-notif-item__text">
          <span className="cs-notif-item__title">{n.title}</span>
          {n.body && <span className="cs-notif-item__body">{n.body}</span>}
          <span className="cs-notif-item__time">{timeLabel(n.created)}</span>
        </span>
        {!n.isRead && (
          <span className="cs-notif-item__dot" title={formatMessage(messages.unread)}>
            <span className="sr-only">{formatMessage(messages.unread)}</span>
          </span>
        )}
      </>
    );
    const className = `cs-notif-item${n.isRead ? '' : ' is-unread'}`;
    // Marking read is fire-and-forget: following the link is not held up by it.
    const onClick = () => { if (!n.isRead) { markRead([n.id]); } };
    return href
      ? <a key={n.id} className={className} href={href} onClick={onClick}>{content}</a>
      : <button key={n.id} type="button" className={className} onClick={onClick}>{content}</button>;
  };

  let body;
  if (status === 'error') {
    body = (
      <div className="cs-notif__state">
        <p className="cs-notif__state-title">{formatMessage(messages.error)}</p>
        <button type="button" className="cs-notif__retry" onClick={load}>{formatMessage(messages.retry)}</button>
      </div>
    );
  } else if (status !== 'ready') {
    body = <div className="cs-notif__state"><p className="cs-notif__state-hint">{formatMessage(messages.loading)}</p></div>;
  } else if (shown.length === 0) {
    body = (
      <div className="cs-notif__state">
        <p className="cs-notif__state-title">{formatMessage(messages.empty)}</p>
        <p className="cs-notif__state-hint">{formatMessage(messages.emptyHint)}</p>
      </div>
    );
  } else {
    body = <div className="cs-notif__list">{shown.map(renderItem)}</div>;
  }

  return ReactDOM.createPortal(
    <>
      <div
        className={`cs-notif-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className={`cs-notif${isOpen ? ' is-open' : ''}`}
        aria-label={formatMessage(messages.heading)}
        aria-hidden={!isOpen}
        id="cs-notifications-drawer"
      >
        <div className="cs-notif__header">
          <span className="cs-notif__heading">{formatMessage(messages.heading)}</span>
          <div className="cs-notif__actions">
            {unreadCount > 0 && (
              <button type="button" className="cs-notif__markall" onClick={() => markRead(null)}>
                {formatMessage(messages.markAllRead)}
              </button>
            )}
            <button type="button" className="cs-notif__close" onClick={onClose} aria-label={formatMessage(messages.close)}>
              <Icon src={Close} />
            </button>
          </div>
        </div>
        {body}
        <a className="cs-notif__footer" href={seeAllHref}>{formatMessage(messages.seeAll)}</a>
      </aside>
    </>,
    document.body,
  );
};

NotificationsDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  /** Called with the server's unread count after each fetch or mark-read. */
  onUnreadChange: PropTypes.func.isRequired,
  seeAllHref: PropTypes.string.isRequired,
};

export default NotificationsDrawer;
