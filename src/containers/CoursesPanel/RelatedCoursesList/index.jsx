import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const RelatedCoursesList = ({  }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="tw:py-8">
      <h6 className="tw:text-secondary tw:text-[28px] tw:font-semibold tw:py-4">{formatMessage(messages.relatedCourses)}</h6>

      {/* Static Courses */}
      <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-4">
        <div className="tw:bg-white tw:shadow-md tw:rounded-lg tw:overflow-hidden">
          <img
            src="https://www.dropbox.com/scl/fi/r3cbzqu9xq4z761sjmdtk/datascience.png?rlkey=hd7zl58n47vf874hbnsgjvvzj&st=15gbjx1l&raw=1"
            alt="Data Science"
            className="tw:w-full tw:h-58 tw:object-cover"
          />
          <div className="tw:text-center tw:p-6">
            <h3 className="tw:text-xl tw:font-bold tw:text-[#6255A1] tw:mb-2">
              Data Science
            </h3>
            <p className="tw:text-gray-600 tw:text-sm tw:mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt.
            </p>
          </div>
        </div>

        <div className="tw:bg-white tw:shadow-md tw:rounded-lg tw:overflow-hidden">
          <img
            src="https://www.dropbox.com/scl/fi/r3cbzqu9xq4z761sjmdtk/datascience.png?rlkey=hd7zl58n47vf874hbnsgjvvzj&st=15gbjx1l&raw=1"
            alt="Data Science"
            className="tw:w-full tw:h-58 tw:object-cover"
          />
          <div className="tw:text-center tw:p-6">
            <h3 className="tw:text-xl tw:font-bold tw:text-[#6255A1] tw:mb-2">
              Data Science
            </h3>
            <p className="tw:text-gray-600 tw:text-sm tw:mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt.
            </p>
          </div>
        </div>

        <div className="tw:bg-white tw:shadow-md tw:rounded-lg tw:overflow-hidden">
          <img
            src="https://www.dropbox.com/scl/fi/r3cbzqu9xq4z761sjmdtk/datascience.png?rlkey=hd7zl58n47vf874hbnsgjvvzj&st=15gbjx1l&raw=1"
            alt="Data Science"
            className="tw:w-full tw:h-58 tw:object-cover"
          />
          <div className="tw:text-center tw:p-6">
            <h3 className="tw:text-xl tw:font-bold tw:text-[#6255A1] tw:mb-2">
              Data Science
            </h3>
            <p className="tw:text-gray-600 tw:text-sm tw:mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt.
            </p>
          </div>
        </div>

        <div className="tw:bg-white tw:shadow-md tw:rounded-lg tw:overflow-hidden">
          <img
            src="https://www.dropbox.com/scl/fi/r3cbzqu9xq4z761sjmdtk/datascience.png?rlkey=hd7zl58n47vf874hbnsgjvvzj&st=15gbjx1l&raw=1"
            alt="Data Science"
            className="tw:w-full tw:h-58 tw:object-cover"
          />
          <div className="tw:text-center tw:p-6">
            <h3 className="tw:text-xl tw:font-bold tw:text-[#6255A1] tw:mb-2">
              Data Science
            </h3>
            <p className="tw:text-gray-600 tw:text-sm tw:mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default RelatedCoursesList;