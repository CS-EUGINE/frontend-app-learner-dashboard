import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Icon, IconButton } from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';

import NotificationItem from './NotificationItem';
import messages from './messages';

// The drawer is the recent feed, not the archive. Everything older lives on the
// page behind "See all".
export const PANEL_SIZE = 8;

/**
 * The notification drawer: a full-height panel down the right-hand edge, over a
 * dimmed page.
 *
 * Hand-rolled rather than a Paragon `ModalPopup` or `Sheet`, after both fought
 * back. The popup has to be positioned against an element inside the
 * third-party Header, and when that fails it does not degrade — it lands in the
 * top-left corner of the viewport. The Sheet brings its own stylesheet whose
 * width rules a page-level override could not reliably beat. A fixed-position
 * aside owns its geometry outright: no anchor to miss, no cascade to lose, and
 * the transition is ours to time.
 *
 * It stays mounted while closed (translated off-screen and inert) so opening
 * and closing can animate. `aria-hidden` and `visibility` keep it off the
 * accessibility tree and out of the tab order in that state.
 */
export const NotificationsPanel = ({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkAllRead,
  onActivate,
}) => {
  const { formatMessage } = useIntl();
  const drawerRef = React.useRef(null);
  const shown = notifications.slice(0, PANEL_SIZE);

  // Escape closes it, the way every other dismissible overlay on the site does.
  React.useEffect(() => {
    if (!isOpen) { return undefined; }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { onClose(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Focus moves into the drawer on open, so a keyboard user's next Tab is
  // inside it rather than back at the top of the page behind it.
  React.useEffect(() => {
    if (isOpen && drawerRef.current) { drawerRef.current.focus(); }
  }, [isOpen]);

  return (
    <>
      <div
        className={classNames('notifications-backdrop', { 'is-open': isOpen })}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
        data-testid="notifications-backdrop"
      />
      <aside
        ref={drawerRef}
        tabIndex={-1}
        className={classNames('notifications-drawer', { 'is-open': isOpen })}
        aria-label={formatMessage(messages.heading)}
        aria-hidden={!isOpen}
        data-testid="notifications-drawer"
      >
        <div className="notifications-drawer__header">
          <span className="notifications-drawer__heading">{formatMessage(messages.heading)}</span>
          <div className="notifications-drawer__actions">
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={onMarkAllRead}>
                {formatMessage(messages.markAllRead)}
              </Button>
            )}
            <IconButton
              src={Close}
              iconAs={Icon}
              alt={formatMessage(messages.close)}
              onClick={onClose}
              size="sm"
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="notifications-drawer__empty">
            <p className="notifications-drawer__empty-title">{formatMessage(messages.empty)}</p>
            <p className="notifications-drawer__empty-hint">{formatMessage(messages.emptyHint)}</p>
          </div>
        ) : (
          <div className="notifications-drawer__list">
            {shown.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onActivate={onActivate}
              />
            ))}
          </div>
        )}

        <a className="notifications-drawer__footer" href={`${getConfig().PUBLIC_PATH}notifications`}>
          {formatMessage(messages.seeAll)}
        </a>
      </aside>
    </>
  );
};

NotificationsPanel.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number })).isRequired,
  unreadCount: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMarkAllRead: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
};

export default NotificationsPanel;
