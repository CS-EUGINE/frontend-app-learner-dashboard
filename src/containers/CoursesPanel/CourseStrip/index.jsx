import PropTypes from 'prop-types';

import { formatCurrency } from 'utils';

import CourseCard from 'components/CourseCard';

/**
 * Shape of a course as /api/learner_home/catalog/ returns it.
 */
export const catalogCourseShape = PropTypes.shape({
  courseId: PropTypes.string.isRequired,
  courseUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  orgName: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.number,
  currency: PropTypes.string,
  isPriced: PropTypes.bool,
  selfPaced: PropTypes.bool,
  startDate: PropTypes.string,
});

/**
 * A titled four-up row of course cards. Both the "Related" and "Recommended"
 * strips are this — they differ only in heading and which slice of the catalog
 * they get, and sharing one component is what keeps them from drifting apart.
 *
 * Renders nothing when the slice is empty, rather than leaving a bare heading.
 */
const CourseStrip = ({ heading, courses }) => {
  if (!courses.length) { return null; }

  return (
    <div className="tw:py-8">
      <h6 className="tw:text-secondary tw:text-[28px] tw:font-semibold tw:py-4">{heading}</h6>

      <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-4">
        {courses.map((course) => (
          <CourseCard
            key={course.courseId}
            courseUrl={course.courseUrl}
            imageUrl={course.imageUrl}
            title={course.title}
            orgName={course.orgName}
            description={course.description}
            price={course.isPriced ? formatCurrency(course.price, course.currency) : 'Free'}
            isPriced={course.isPriced}
            selfPaced={course.selfPaced}
            startDate={course.startDate}
          />
        ))}
      </div>
    </div>
  );
};

CourseStrip.propTypes = {
  heading: PropTypes.node.isRequired,
  courses: PropTypes.arrayOf(catalogCourseShape),
};

CourseStrip.defaultProps = {
  courses: [],
};

export default CourseStrip;
