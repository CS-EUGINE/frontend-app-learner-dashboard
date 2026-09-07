/* eslint-disable import/first, import/no-extraneous-dependencies */
// Real React state and real Paragon: the point of this test is what the card
// actually shows, which the setupTest stubs would render as bare strings.
jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { reduxHooks } from 'hooks';
import { useCourseFeedbackContext } from 'containers/CourseFeedbackModal/context';
import FeedbackButton from './FeedbackButton';

jest.mock('hooks', () => ({
  reduxHooks: {
    useCardCourseRunData: jest.fn(),
    useCardCourseData: jest.fn(),
    useMasqueradeData: jest.fn(),
  },
}));
jest.mock('containers/CourseFeedbackModal/context', () => ({
  useCourseFeedbackContext: jest.fn(),
}));
jest.mock('containers/CourseFeedbackModal', () => function MockModal() {
  return <div data-testid="feedback-modal" />;
});

const courseId = 'course-v1:CloudSwyft+FREE101+2026';

const mockCard = ({
  feedbackByCourse = {},
  isLoading = false,
  isMasquerading = false,
} = {}) => {
  reduxHooks.useCardCourseRunData.mockReturnValue({ courseId });
  reduxHooks.useCardCourseData.mockReturnValue({ courseName: 'Intro to Open Source' });
  reduxHooks.useMasqueradeData.mockReturnValue({ isMasquerading });
  useCourseFeedbackContext.mockReturnValue({
    feedbackByCourse,
    isLoading,
    recordFeedback: jest.fn(),
  });
};

describe('FeedbackButton', () => {
  it('offers the button on a course with no review yet', () => {
    mockCard();
    render(<FeedbackButton cardId="card-1" />);
    expect(screen.getByRole('button', { name: 'Give feedback' })).toBeInTheDocument();
    expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument();
  });

  it('opens the modal when clicked', () => {
    mockCard();
    render(<FeedbackButton cardId="card-1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Give feedback' }));
    expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
  });

  // Feedback is once per course, so the affordance goes away entirely rather
  // than sitting there disabled.
  it('shows the sent marker instead once the course has been reviewed', () => {
    mockCard({ feedbackByCourse: { [courseId]: { courseId, rating: 4 } } });
    render(<FeedbackButton cardId="card-1" />);
    expect(screen.getByTestId('CourseFeedbackSent')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Give feedback' })).not.toBeInTheDocument();
  });

  it('renders nothing until the reviewed list has loaded', () => {
    mockCard({ isLoading: true });
    const { container } = render(<FeedbackButton cardId="card-1" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('disables the button for masquerading staff', () => {
    mockCard({ isMasquerading: true });
    render(<FeedbackButton cardId="card-1" />);
    expect(screen.getByRole('button', { name: 'Give feedback' })).toBeDisabled();
  });
});
