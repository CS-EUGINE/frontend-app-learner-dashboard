import React from 'react';
import PropTypes from 'prop-types';

import { ActionRow } from '@openedx/paragon';

import { reduxHooks } from 'hooks';

import CourseCardActionSlot from 'plugin-slots/CourseCardActionSlot';
import FeedbackButton from './FeedbackButton';
import SelectSessionButton from './SelectSessionButton';
import BeginCourseButton from './BeginCourseButton';
import ResumeButton from './ResumeButton';
import ViewCourseButton from './ViewCourseButton';

export const CourseCardActions = ({ cardId }) => {
  const { isEntitlement, isFulfilled } = reduxHooks.useCardEntitlementData(cardId);
  const {
    hasStarted,
  } = reduxHooks.useCardEnrollmentData(cardId);
  const { isArchived } = reduxHooks.useCardCourseRunData(cardId);

  return (
    <ActionRow data-test-id="CourseCardActions">
      <CourseCardActionSlot cardId={cardId} />
      {isEntitlement && (isFulfilled
        ? <ViewCourseButton cardId={cardId} />
        : <SelectSessionButton cardId={cardId} />
      )}
      {(isArchived && !isEntitlement) && (
        <ViewCourseButton cardId={cardId} />
      )}
      {/* Feedback sits beside Resume and under exactly the same condition: an
          in-progress course the learner has actually opened. It comes first so
          the primary action stays at the end of the row. */}
      {!(isArchived || isEntitlement) && hasStarted && (
        <FeedbackButton cardId={cardId} />
      )}
      {!(isArchived || isEntitlement) && (hasStarted
        ? <ResumeButton cardId={cardId} />
        : <BeginCourseButton cardId={cardId} />
      )}
    </ActionRow>
  );
};
CourseCardActions.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardActions;
