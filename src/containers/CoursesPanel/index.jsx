import React, { useState } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';
import CourseListSlot from 'plugin-slots/CourseListSlot';
import NoCoursesViewSlot from 'plugin-slots/NoCoursesViewSlot';

import {
  useCourseListData,
  useInProgressCourseListData,
  useCompletedCourseListData,
  useCourseCatalog,
} from './hooks';
import { Container, Tabs, Tab } from '@openedx/paragon';

import myDashboardBg from 'assets/my-dashboard-bg.png';
import messages from './messages';

import './index.scss';
import RelatedCoursesList from './RelatedCoursesList';
import RecommendedCoursesList from './RecommendedCoursesList';
import AnnouncementsList from './AnnouncementsList';

/**
 * Renders the list of CourseCards, as well as the controls (CourseFilterControls) for modifying the list.
 * Also houses the NoCoursesView to display if the user hasn't enrolled in any courses.
 * @returns List of courses as CourseCards or empty state
*/
export const CoursesPanel = () => {
  const { formatMessage } = useIntl();
  const hasCourses = reduxHooks.useHasCourses();
  const allCoursesData = useCourseListData();
  const inProgressData = useInProgressCourseListData();
  const completedData = useCompletedCourseListData();
  const { catalog } = useCourseCatalog();
  const [activeTab, setActiveTab] = useState('all');

  const activeTabHasCourses = () => {
    switch (activeTab) {
      case 'all': return allCoursesData?.visibleList.length > 0;
      case 'in-progress': return inProgressData?.visibleList.length > 0;
      case 'completed': return completedData?.visibleList.length > 0;
      default: return false;
    }
  };

  return (
    <div className="course-list-container">
      <div className="course-list-heading-container tw:relative">
        <div
          className="tw:absolute tw:inset-0 tw:bg-cover tw:bg-center tw:z-0"
          style={{ backgroundImage: `url(${myDashboardBg})` }}
        ></div>

        <div className="tw:absolute tw:inset-0 tw:bg-[#4EA1C9] tw:opacity-[0.92] tw:z-0" />

        <div className="tw:relative tw:w-full tw:py-10 tw:z-10">
          <Container fluid size='xl'>
            <h2 className="course-list-title tw:text-white">{formatMessage(messages.myCourses)}</h2>
          </Container>
        </div>
      </div>
      <Container fluid size='xl'>
        <Tabs
          variant="tabs"
          defaultActiveKey="all"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          id="course-list-content-tab"
          className="tw:border-none"
        >
          <Tab
            eventKey="all" 
            title={
              <span>
                All <span>({allCoursesData?.visibleList.length ?? 0})</span>
              </span>
            } 
            tabClassName="tw:px-8 tw:py-4"
          >
            <section className='tw:my-8'>
              {allCoursesData?.visibleList.length > 0 ? <CourseListSlot courseListData={allCoursesData} /> : <NoCoursesViewSlot />}
            </section>
          </Tab>
          <Tab
            eventKey="in-progress"
            title={
              <span>
                In Progress <span>({inProgressData?.visibleList.length ?? 0})</span>
              </span>
            }
            tabClassName="tw:px-8 tw:py-4"
          >
            <section className='tw:my-8'>
              {inProgressData?.visibleList.length > 0 ? <CourseListSlot courseListData={inProgressData} /> : <NoCoursesViewSlot />}
            </section>
          </Tab>
          <Tab
            eventKey="completed"
            title={
              <span>
                Completed <span>({completedData?.visibleList.length ?? 0})</span>
              </span>
            }
            tabClassName="tw:px-8 tw:py-4"
          >
            <section className='tw:my-8'>
              {completedData?.visibleList.length > 0 ? <CourseListSlot courseListData={completedData} /> : <NoCoursesViewSlot />}
            </section>
          </Tab>
        </Tabs>
        
        {activeTabHasCourses() && (
          <RelatedCoursesList courses={catalog.related} />
        )}

        <RecommendedCoursesList courses={catalog.recommended} />

        {/* Announcements are site-wide, not course-scoped: they render for every
            signed-in user regardless of role or enrollments. The component
            returns null while loading and when there is nothing to show, so
            mounting it unconditionally costs nothing on an empty dashboard. */}
        <AnnouncementsList />
        
      </Container>
    </div>
  );
};

CoursesPanel.propTypes = {};

export default CoursesPanel;
