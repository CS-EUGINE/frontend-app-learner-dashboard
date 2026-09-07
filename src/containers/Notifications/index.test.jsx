/* eslint-disable import/first, import/no-extraneous-dependencies */
// Real React state and real Paragon: setupTest stubs both, and stubbed Paragon
// never renders its children, which would leave these asserting on an empty
// popup.
jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import NotificationBell from './NotificationBell';
import NotificationItem from './NotificationItem';
import NotificationsPanel from './NotificationsPanel';

jest.mock('@edx/frontend-platform/logging', () => ({ logError: jest.fn() }));

const notification = (overrides = {}) => ({
  id: 1,
  kind: 'payment_successful',
  kindLabel: 'Payment successful',
  title: 'Payment successful',
  body: 'You paid ₱1,500.00 for 1 course.',
  linkUrl: '/dashboard',
  isRead: false,
  isSecurity: false,
  created: new Date().toISOString(),
  ...overrides,
});

describe('NotificationBell', () => {
  it('shows the unread count', () => {
    render(<NotificationBell count={3} label="Notifications, 3 unread" />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('caps the badge at 99+', () => {
    render(<NotificationBell count={250} label="Notifications" />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('shows no badge at all when nothing is unread', () => {
    const { container } = render(<NotificationBell count={0} label="Notifications" />);
    expect(container.querySelector('.notification-bell__badge')).toBeNull();
  });
});

describe('NotificationItem', () => {
  it('is a link when the notification has somewhere to go', () => {
    render(<NotificationItem notification={notification()} onActivate={jest.fn()} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard');
  });

  // A notification with no destination must not look clickable-to-nowhere.
  it('is a plain button when it does not', () => {
    render(<NotificationItem notification={notification({ linkUrl: '' })} onActivate={jest.fn()} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has an icon for every kind the server can send', () => {
    const kinds = [
      'payment_successful', 'course_completed', 'certificate_ready', 'new_course',
      'latest_news', 'announcement', 'account_updated', 'password_updated', 'profile_updated',
    ];
    kinds.forEach((kind) => {
      const { container, unmount } = render(
        <NotificationItem notification={notification({ kind })} onActivate={jest.fn()} />,
      );
      expect(container.querySelector('.notification-item__icon .pgn__icon')).not.toBeNull();
      unmount();
    });
  });

  it('marks itself read when activated', () => {
    const onActivate = jest.fn();
    render(<NotificationItem notification={notification({ id: 7 })} onActivate={onActivate} />);
    fireEvent.click(screen.getByRole('link'));
    expect(onActivate).toHaveBeenCalledWith(7);
  });

  it('marks the unread ones for a screen reader, not by colour alone', () => {
    render(<NotificationItem notification={notification()} onActivate={jest.fn()} />);
    expect(screen.getByText('Unread')).toBeInTheDocument();
  });

  it('says nothing about unread state once it is read', () => {
    render(<NotificationItem notification={notification({ isRead: true })} onActivate={jest.fn()} />);
    expect(screen.queryByText('Unread')).toBeNull();
  });
});

describe('NotificationsPanel', () => {
  const panelProps = (overrides = {}) => ({
    notifications: [notification()],
    unreadCount: 1,
    isOpen: true,
    onClose: jest.fn(),
    onMarkAllRead: jest.fn(),
    onActivate: jest.fn(),
    ...overrides,
  });

  it('lists the notifications it was given', () => {
    render(<NotificationsPanel {...panelProps()} />);
    expect(screen.getByText('Payment successful')).toBeInTheDocument();
    expect(screen.getByText('See all notifications')).toBeInTheDocument();
  });

  it('offers Mark all read only when something is unread', () => {
    const { rerender } = render(<NotificationsPanel {...panelProps()} />);
    expect(screen.getByRole('button', { name: 'Mark all read' })).toBeInTheDocument();
    rerender(<NotificationsPanel {...panelProps({ unreadCount: 0 })} />);
    expect(screen.queryByRole('button', { name: 'Mark all read' })).toBeNull();
  });

  it('marks everything read on demand', () => {
    const onMarkAllRead = jest.fn();
    render(<NotificationsPanel {...panelProps({ onMarkAllRead })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark all read' }));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it('shows an empty state rather than a bare box', () => {
    render(<NotificationsPanel {...panelProps({ notifications: [], unreadCount: 0 })} />);
    expect(screen.getByText('Nothing yet.')).toBeInTheDocument();
  });

  // The drawer owns its own geometry: no anchor to miss, which is what put the
  // first attempt in the top-left corner of the viewport.
  it('opens as a drawer over a backdrop', () => {
    render(<NotificationsPanel {...panelProps()} />);
    expect(screen.getByTestId('notifications-drawer')).toHaveClass('is-open');
    expect(screen.getByTestId('notifications-backdrop')).toHaveClass('is-open');
  });

  it('closes when the dimmed background is clicked', () => {
    const onClose = jest.fn();
    render(<NotificationsPanel {...panelProps({ onClose })} />);
    fireEvent.click(screen.getByTestId('notifications-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', () => {
    const onClose = jest.fn();
    render(<NotificationsPanel {...panelProps({ onClose })} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('ignores Escape while it is already closed', () => {
    const onClose = jest.fn();
    render(<NotificationsPanel {...panelProps({ isOpen: false, onClose })} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('can be dismissed from its own close button', () => {
    const onClose = jest.fn();
    render(<NotificationsPanel {...panelProps({ onClose })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close notifications' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('is parked off-screen and hidden from assistive tech while closed', () => {
    render(<NotificationsPanel {...panelProps({ isOpen: false })} />);
    const drawer = screen.getByTestId('notifications-drawer');
    expect(drawer).not.toHaveClass('is-open');
    expect(drawer).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('notifications-backdrop')).not.toHaveClass('is-open');
  });
});
