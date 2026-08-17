import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import CourseStrip, { catalogCourseShape } from '../CourseStrip';
import messages from './messages';

/**
 * Courses from organizations the learner already studies with, straight from
 * /api/learner_home/catalog/.
 */
const RelatedCoursesList = ({ courses }) => {
  const { formatMessage } = useIntl();

  return (
    <CourseStrip heading={formatMessage(messages.relatedCourses)} courses={courses} />
  );
};

RelatedCoursesList.propTypes = {
  courses: PropTypes.arrayOf(catalogCourseShape),
};

RelatedCoursesList.defaultProps = {
  courses: [],
};

export default RelatedCoursesList;
