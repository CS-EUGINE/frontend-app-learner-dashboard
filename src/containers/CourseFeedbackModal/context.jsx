import React from 'react';
import PropTypes from 'prop-types';

import { logError } from '@edx/frontend-platform/logging';

import api from 'data/services/lms/api';

/**
 * Which courses this learner has already reviewed.
 *
 * Fetched once for the whole dashboard and shared, rather than per card: a
 * learner with twelve enrollments would otherwise fire twelve requests to
 * render twelve buttons. Cards read the map; the modal writes into it on a
 * successful submit, so the button flips to its "sent" state without a refetch.
 *
 * The default value is a working empty state, so a card rendered outside the
 * provider still shows its button and still submits — the once-per-course rule
 * lives on the server, not in this map.
 */
const defaultValue = {
  feedbackByCourse: {},
  isLoading: false,
  recordFeedback: () => {},
};

export const CourseFeedbackContext = React.createContext(defaultValue);

export const CourseFeedbackProvider = ({ children }) => {
  const [feedbackByCourse, setFeedbackByCourse] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    api.fetchCourseFeedback()
      .then(({ data }) => {
        if (cancelled) { return; }
        setFeedbackByCourse((data.feedback || []).reduce(
          (acc, feedback) => ({ ...acc, [feedback.courseId]: feedback }),
          {},
        ));
      })
      // A failed fetch leaves the map empty, so every card offers its button.
      // A learner who has already reviewed one then gets the server's 409,
      // which the modal turns back into the "already sent" state.
      .catch((error) => { logError(error); })
      .finally(() => { if (!cancelled) { setIsLoading(false); } });

    return () => { cancelled = true; };
  }, []);

  const recordFeedback = React.useCallback((feedback) => {
    setFeedbackByCourse((current) => ({ ...current, [feedback.courseId]: feedback }));
  }, []);

  const value = React.useMemo(
    () => ({ feedbackByCourse, isLoading, recordFeedback }),
    [feedbackByCourse, isLoading, recordFeedback],
  );

  return (
    <CourseFeedbackContext.Provider value={value}>
      {children}
    </CourseFeedbackContext.Provider>
  );
};
CourseFeedbackProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCourseFeedbackContext = () => React.useContext(CourseFeedbackContext);

export default CourseFeedbackProvider;
