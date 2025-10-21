import { useIntl } from '@edx/frontend-platform/i18n';

import React, { useState } from 'react';

import messages from './messages';
import CourseCard from '../../../components/CourseCard';

const RelatedCoursesList = ({  }) => {
  const { formatMessage } = useIntl();
  const [hoveredValue, setHoveredValue] = useState(null);

  return (
    <div className="tw:py-8">
      <h6 className="tw:text-secondary tw:text-[28px] tw:font-semibold tw:py-4">{formatMessage(messages.relatedCourses)}</h6>

      {/* Static Courses */}
      <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <CourseCard
            key={index}
            courseUrl={'http://local.openedx.io:8000/courses/course-v1:UCSICollege+INF246x+2022_T1/about'}
            imageUrl={'https://www.dropbox.com/scl/fi/r3cbzqu9xq4z761sjmdtk/datascience.png?rlkey=hd7zl58n47vf874hbnsgjvvzj&st=15gbjx1l&raw=1'}
            title={'Data Science'}
            description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'}
            price={'$28'}
            rating={4.6}
            selfPaced={true}
          />
        ))}
      </div>
    </div>
  );
}
 
export default RelatedCoursesList;