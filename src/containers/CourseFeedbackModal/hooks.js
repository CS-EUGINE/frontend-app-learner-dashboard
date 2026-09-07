import React from 'react';

import { logError } from '@edx/frontend-platform/logging';

import api from 'data/services/lms/api';

import { useCourseFeedbackContext } from './context';

// Matched to the serializer's floor. Checked here too so a learner is told
// before the round trip, not after it.
export const MIN_COMMENT_LENGTH = 20;

export const RATING_VALUES = [1, 2, 3, 4, 5];

export const RECOMMEND = {
  yes: 'yes',
  no: 'no',
  skip: 'skip',
};

// The model's `would_recommend` is nullable on purpose: "no" and "did not
// answer" are different answers, and a boolean alone cannot carry both.
const recommendValue = {
  [RECOMMEND.yes]: true,
  [RECOMMEND.no]: false,
  [RECOMMEND.skip]: null,
};

/**
 * Form state for one course's feedback modal.
 *
 * Validation is duplicated from the server rather than trusted to it: the
 * server is still the authority (it re-checks enrollment, the length floor and
 * the once-per-course rule), this only saves a round trip on the obvious cases.
 */
export const useCourseFeedbackForm = ({ courseId, onClose }) => {
  const { recordFeedback } = useCourseFeedbackContext();

  const [rating, setRating] = React.useState(0);
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [headline, setHeadline] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [recommend, setRecommend] = React.useState(RECOMMEND.skip);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState(null);

  const validate = () => {
    const errors = {};
    if (!RATING_VALUES.includes(rating)) { errors.rating = true; }
    if (comment.trim().length < MIN_COMMENT_LENGTH) { errors.comment = true; }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = (event) => {
    if (event) { event.preventDefault(); }
    if (isSubmitting || !validate()) { return; }

    setIsSubmitting(true);
    setFormError(null);

    api.postCourseFeedback({
      courseId,
      rating,
      headline: headline.trim(),
      comment: comment.trim(),
      wouldRecommend: recommendValue[recommend],
    })
      .then(({ data }) => {
        recordFeedback(data.feedback);
        onClose();
      })
      .catch((error) => {
        const { status, data } = error.response || {};
        // 409 means this course was already reviewed — most likely in another
        // tab, or the initial fetch failed and left the button showing. The
        // server hands back the review that already exists, so record it and
        // close: the card flips to "sent" and the learner is not stuck
        // arguing with a form that can never succeed.
        if (status === 409 && data?.feedback) {
          recordFeedback(data.feedback);
          onClose();
          return;
        }
        if (status === 400 && data?.errors) {
          setFieldErrors({
            rating: Boolean(data.errors.rating),
            comment: Boolean(data.errors.comment),
          });
          return;
        }
        logError(error);
        setFormError(data?.error || true);
      })
      .finally(() => { setIsSubmitting(false); });
  };

  return {
    rating,
    setRating,
    hoveredRating,
    setHoveredRating,
    headline,
    setHeadline,
    comment,
    setComment,
    recommend,
    setRecommend,
    isSubmitting,
    fieldErrors,
    formError,
    submit,
  };
};

export default useCourseFeedbackForm;
