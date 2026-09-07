import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { Star } from '@openedx/paragon/icons';

import { reduxHooks } from 'hooks';
import CourseFeedbackModal from 'containers/CourseFeedbackModal';
import { useCourseFeedbackContext } from 'containers/CourseFeedbackModal/context';
import messages from 'containers/CourseFeedbackModal/messages';

import ActionButton from './ActionButton';

/**
 * "Give feedback", next to Resume on an in-progress course card.
 *
 * Only rendered where ResumeButton is (see CourseCardActions): a learner who
 * has not opened the course has nothing to review yet, and one who has
 * archived it is past the point of the question.
 *
 * Once feedback is sent the button is replaced by a static marker rather than
 * a disabled button. Feedback is once per course, so an affordance that can
 * never do anything again should stop looking like one.
 */
export const FeedbackButton = ({ cardId }) => {
  const { formatMessage } = useIntl();
  const { courseId } = reduxHooks.useCardCourseRunData(cardId);
  const { courseName } = reduxHooks.useCardCourseData(cardId);
  const { isMasquerading } = reduxHooks.useMasqueradeData();
  const { feedbackByCourse, isLoading } = useCourseFeedbackContext();
  const [isOpen, setIsOpen] = React.useState(false);

  const existing = feedbackByCourse[courseId];

  // Nothing until we know: rendering the button first and swapping it for the
  // sent marker a moment later reads as a glitch, and invites a click that
  // would only earn a 409.
  if (isLoading) { return null; }

  if (existing) {
    return (
      <span
        className="course-feedback-sent"
        title={formatMessage(messages.sentTooltip, { rating: existing.rating })}
        data-testid="CourseFeedbackSent"
      >
        <Icon src={Star} screenReaderText="" />
        {formatMessage(messages.feedbackSent)}
      </span>
    );
  }

  return (
    <>
      <ActionButton
        variant="outline-primary"
        // Masquerading staff are looking at someone else's dashboard; a review
        // filed from here would be written in that learner's name.
        disabled={isMasquerading}
        onClick={() => setIsOpen(true)}
        data-testid="CourseFeedbackButton"
      >
        {formatMessage(messages.giveFeedback)}
      </ActionButton>
      {/* Mounted only once opened: a dashboard of twelve cards should not hold
          twelve dialogs and their form state. */}
      {isOpen && (
        <CourseFeedbackModal
          courseId={courseId}
          courseName={courseName}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
FeedbackButton.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default FeedbackButton;
