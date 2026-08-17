import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import CourseStrip, { catalogCourseShape } from '../CourseStrip';
import messages from './messages';

/**
 * The rest of the catalog the learner isn't enrolled in, straight from
 * /api/learner_home/catalog/.
 */
const RecommendedCoursesList = ({ courses }) => {
  const { formatMessage } = useIntl();

  return (
    <CourseStrip heading={formatMessage(messages.recommendedCourses)} courses={courses} />
  );
};

RecommendedCoursesList.propTypes = {
  courses: PropTypes.arrayOf(catalogCourseShape),
};

RecommendedCoursesList.defaultProps = {
  courses: [],
};

export default RecommendedCoursesList;
