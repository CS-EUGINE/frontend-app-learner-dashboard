import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { baseAppUrl } from 'data/services/lms/urls';

import noCourseSVG from 'assets/no-course.svg';
import { reduxHooks } from 'hooks';

import messages from './messages';

export const NoCoursesView = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  return (
    <div
      className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-gray-200 tw:rounded-lg tw:py-32 tw:px-6 tw:bg-no-repeat tw:bg-center"
      style={{ backgroundImage: `url(${noCourseSVG})`, backgroundSize: '340px' }}
    >
      <h2 className="tw:text-xl tw:font-bold tw:text-secondary tw:mb-4">
        {formatMessage(messages.lookingForChallengePrompt)}
      </h2>
      <a
        href={baseAppUrl(courseSearchUrl)}
        className="explore-courses-cta tw:text-white tw:px-6 tw:py-2 tw:rounded tw:text-sm tw:font-semibold tw:no-underline"
      >
        {formatMessage(messages.exploreCoursesButton)}
      </a>
    </div>
  );
};

export default NoCoursesView;
