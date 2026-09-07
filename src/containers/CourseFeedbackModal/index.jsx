import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Alert,
  Button,
  Form,
  Icon,
  ModalDialog,
} from '@openedx/paragon';
import { Star } from '@openedx/paragon/icons';

import {
  MIN_COMMENT_LENGTH,
  RATING_VALUES,
  RECOMMEND,
  useCourseFeedbackForm,
} from './hooks';
import messages from './messages';

import './index.scss';

/**
 * The feedback form for one course, in a dialog off the course card.
 *
 * A dialog rather than a page: the learner is already looking at the course
 * they want to talk about, and sending them somewhere else to say it is how
 * feedback does not get written.
 */
export const CourseFeedbackModal = ({
  courseId,
  courseName,
  isOpen,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const {
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
  } = useCourseFeedbackForm({ courseId, onClose });

  const ratingLabels = {
    1: formatMessage(messages.rating1),
    2: formatMessage(messages.rating2),
    3: formatMessage(messages.rating3),
    4: formatMessage(messages.rating4),
    5: formatMessage(messages.rating5),
  };
  // Hovering previews the rating without committing it, which is what makes a
  // star row feel like a control rather than five buttons.
  const shownRating = hoveredRating || rating;

  return (
    <ModalDialog
      title={formatMessage(messages.modalTitle, { courseName })}
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isOverflowVisible={false}
      className="course-feedback-modal"
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {formatMessage(messages.modalTitle, { courseName })}
        </ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>
        <form onSubmit={submit} noValidate>
          {formError && (
            <Alert variant="danger">
              {typeof formError === 'string' ? formError : formatMessage(messages.genericError)}
            </Alert>
          )}

          <p className="course-feedback-modal__intro">
            {formatMessage(messages.modalIntro)}
          </p>

          <Form.Group>
            <Form.Label id={`feedback-rating-label-${courseId}`}>
              {formatMessage(messages.ratingLabel)}
            </Form.Label>
            {/* Real radios, visually replaced by stars: that keeps arrow-key
                navigation, the required-one-of-five semantics and the form
                post behaviour the browser already gives a radio group.
                The mouse handler sits on a plain wrapper rather than on the
                radiogroup itself: an interactive role carrying a handler has
                to be focusable, and here it is the radios inside that take
                focus, not the group. */}
            <div onMouseLeave={() => setHoveredRating(0)}>
              <div
                className="course-feedback-stars"
                role="radiogroup"
                aria-labelledby={`feedback-rating-label-${courseId}`}
              >
                {RATING_VALUES.map((value) => (
                  <React.Fragment key={value}>
                    <input
                      className="course-feedback-stars__input"
                      type="radio"
                      id={`feedback-rating-${courseId}-${value}`}
                      name={`feedback-rating-${courseId}`}
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                    />
                    <label
                      className={classNames('course-feedback-stars__star', {
                        'course-feedback-stars__star--on': value <= shownRating,
                      })}
                      htmlFor={`feedback-rating-${courseId}-${value}`}
                      onMouseEnter={() => setHoveredRating(value)}
                    >
                      <Icon
                        src={Star}
                        screenReaderText={formatMessage(messages.starLabel, {
                          value,
                          label: ratingLabels[value],
                        })}
                      />
                    </label>
                  </React.Fragment>
                ))}
                {shownRating > 0 && (
                  <span className="course-feedback-stars__label">{ratingLabels[shownRating]}</span>
                )}
              </div>
            </div>
            {fieldErrors.rating ? (
              <Form.Control.Feedback type="invalid">
                {formatMessage(messages.ratingRequired)}
              </Form.Control.Feedback>
            ) : (
              <Form.Text>{formatMessage(messages.ratingHint)}</Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor={`feedback-headline-${courseId}`}>
              {formatMessage(messages.headlineLabel)}
            </Form.Label>
            <Form.Control
              id={`feedback-headline-${courseId}`}
              value={headline}
              maxLength={120}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder={formatMessage(messages.headlinePlaceholder)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor={`feedback-comment-${courseId}`}>
              {formatMessage(messages.commentLabel)}
            </Form.Label>
            <Form.Control
              as="textarea"
              id={`feedback-comment-${courseId}`}
              rows={5}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={formatMessage(messages.commentPlaceholder)}
              isInvalid={Boolean(fieldErrors.comment)}
            />
            {fieldErrors.comment ? (
              <Form.Control.Feedback type="invalid">
                {formatMessage(messages.commentTooShort, { min: MIN_COMMENT_LENGTH })}
              </Form.Control.Feedback>
            ) : (
              <Form.Text>{formatMessage(messages.commentHint, { min: MIN_COMMENT_LENGTH })}</Form.Text>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>{formatMessage(messages.recommendLabel)}</Form.Label>
            <Form.RadioSet
              name={`feedback-recommend-${courseId}`}
              value={recommend}
              onChange={(event) => setRecommend(event.target.value)}
              isInline
            >
              <Form.Radio value={RECOMMEND.yes}>{formatMessage(messages.recommendYes)}</Form.Radio>
              <Form.Radio value={RECOMMEND.no}>{formatMessage(messages.recommendNo)}</Form.Radio>
              <Form.Radio value={RECOMMEND.skip}>{formatMessage(messages.recommendSkip)}</Form.Radio>
            </Form.RadioSet>
          </Form.Group>
        </form>
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary" disabled={isSubmitting}>
            {formatMessage(messages.cancel)}
          </ModalDialog.CloseButton>
          <Button variant="primary" onClick={submit} disabled={isSubmitting}>
            {formatMessage(isSubmitting ? messages.submitting : messages.submit)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};
CourseFeedbackModal.propTypes = {
  courseId: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CourseFeedbackModal;
