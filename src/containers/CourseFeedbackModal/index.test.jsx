/* eslint-disable import/first, import/no-extraneous-dependencies */
// The modal is real form state, so it needs React's own useState/useEffect
// rather than the stubs setupTest installs.
jest.unmock('react');
// setupTest replaces Paragon with string stubs that never render their
// children, which would leave this test asserting against an empty dialog.
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';

import api from 'data/services/lms/api';
import CourseFeedbackModal from './index';

jest.mock('data/services/lms/api', () => ({
  postCourseFeedback: jest.fn(),
}));

// No logging service is configured under test, so the real logError throws.
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const courseId = 'course-v1:CloudSwyft+FREE101+2026';
const props = {
  courseId,
  courseName: 'Intro to Open Source',
  isOpen: true,
  onClose: jest.fn(),
};

const fillIn = ({
  rating = 4,
  comment = 'Short videos and exercises that made me practise.',
} = {}) => {
  if (rating) {
    fireEvent.click(screen.getByLabelText(`${rating} out of 5 - Very good`));
  }
  fireEvent.change(screen.getByLabelText('Your review'), { target: { value: comment } });
};

describe('CourseFeedbackModal', () => {
  beforeEach(() => {
    api.postCourseFeedback.mockReset();
    props.onClose.mockReset();
  });

  it('offers a rating out of five', () => {
    render(<CourseFeedbackModal {...props} />);
    expect(screen.getAllByRole('radio', { name: /out of 5/ })).toHaveLength(5);
  });

  it('refuses to submit without a rating or a long enough review', () => {
    render(<CourseFeedbackModal {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }));
    expect(screen.getByText('Please choose a rating.')).toBeInTheDocument();
    expect(api.postCourseFeedback).not.toHaveBeenCalled();
  });

  it('posts what was filled in and closes', async () => {
    api.postCourseFeedback.mockResolvedValue({ data: { feedback: { courseId, rating: 4 } } });
    render(<CourseFeedbackModal {...props} />);
    fillIn();
    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(props.onClose).toHaveBeenCalled());
    expect(api.postCourseFeedback).toHaveBeenCalledWith({
      courseId,
      rating: 4,
      headline: '',
      comment: 'Short videos and exercises that made me practise.',
      // "Prefer not to say" is null, not false: the model keeps the two apart.
      wouldRecommend: null,
    });
  });

  it('closes on a 409, since the course was already reviewed elsewhere', async () => {
    api.postCourseFeedback.mockRejectedValue({
      response: { status: 409, data: { feedback: { courseId, rating: 5 } } },
    });
    render(<CourseFeedbackModal {...props} />);
    fillIn();
    fireEvent.click(screen.getByRole('button', { name: 'Send feedback' }));

    await waitFor(() => expect(props.onClose).toHaveBeenCalled());
  });
});
