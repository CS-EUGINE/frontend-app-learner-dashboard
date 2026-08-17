import PropTypes from 'prop-types';

import coursePlaceholder from 'assets/course-placeholder.svg';

import StarRating from '../StarRating';

/**
 * Swap in the placeholder when a course image fails to load. Studio hands out
 * a default image path for courses that never had one uploaded, so the URL
 * looking valid is no guarantee it resolves.
 */
export const handleImageError = (event) => {
  const image = event.currentTarget;
  // Guard against a loop if the placeholder is what failed.
  if (image.getAttribute('src') === coursePlaceholder) { return; }
  image.setAttribute('src', coursePlaceholder);
};

export const formatStartDate = (startDate) => {
  if (!startDate) { return null; }
  const parsed = new Date(startDate);
  if (Number.isNaN(parsed.getTime())) { return null; }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * A course card, styled to match the ones on the LMS /courses page — same
 * badge, cover, centered title, rating row and footer. The two surfaces are
 * kept deliberately identical, so changes here usually belong in
 * themes/tutor-indigo/.../sass/courseware/_discover.scss as well.
 */
const CourseCard = ({
  courseUrl = '#',
  imageUrl,
  title,
  orgName,
  description,
  price,
  isPriced = true,
  rating = 0,
  selfPaced,
  startDate,
}) => {
  const start = formatStartDate(startDate);

  return (
    <a
      href={courseUrl}
      className="tw:block tw:no-underline tw:bg-white tw:rounded-[12px] tw:overflow-hidden tw:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)] tw:hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] tw:hover:-translate-y-0.5 tw:transition tw:duration-200"
    >
      <div className="tw:relative tw:w-full tw:h-[170px] tw:overflow-hidden">
        {/* The cover is genuinely cut on the diagonal rather than tinted, so
            the wedge shows the card behind it. Same shape on /courses. */}
        <img
          src={imageUrl || coursePlaceholder}
          alt={title}
          onError={handleImageError}
          className="tw:w-full tw:h-full tw:object-cover tw:object-center"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)' }}
        />
        {/* A pill, not a circle: "₱3,200" has to fit as comfortably as "Free". */}
        <span
          className={`tw:absolute tw:top-3 tw:left-3 tw:z-[2] tw:px-3 tw:py-1 tw:rounded-full tw:text-white tw:text-[13px]/[1.3] tw:font-bold tw:whitespace-nowrap tw:shadow-[0_1px_3px_rgba(0,0,0,0.25)] ${isPriced ? 'tw:bg-[#12805C]' : 'tw:bg-[#4B5563]'}`}
        >
          {price}
        </span>
      </div>

      <div className="tw:p-4">
        <h3 className="tw:text-center tw:text-[18px]/[24px] tw:font-bold tw:text-[#6255A1] tw:m-0 tw:line-clamp-2">
          {title}
        </h3>
        {orgName && (
          <span className="tw:block tw:text-center tw:text-[13px]/[20px] tw:text-[#70787E] tw:mb-2 tw:truncate">
            {orgName}
          </span>
        )}
        {/* Courses without a short description set in Studio just show none. */}
        {description && (
          <p className="tw:text-[13px]/[18px] tw:text-[#6B7280] tw:mb-3 tw:line-clamp-2">
            {description}
          </p>
        )}

        {/* The platform stores no course ratings yet, so this reads 0 until
            there is something to rate with. It always shows: the row is part
            of the card's shape, on this surface and on /courses. */}
        <div className="tw:flex tw:items-center tw:gap-2 tw:mb-2.5 tw:text-[13px] tw:text-[#6B7280]">
          <span className="tw:flex tw:text-[14px]">
            <StarRating max={5} value={rating} disabled color="#F5A623" />
          </span>
          <span aria-hidden="true" className="tw:text-[#D1D5DB]">|</span>
          <span className="tw:whitespace-nowrap">{`${rating} Reviews`}</span>
        </div>

        <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:border-t tw:border-[#F3F4F6] tw:pt-2.5">
          {start && (
            <span className="tw:inline-flex tw:items-center tw:gap-1.5 tw:text-[13px] tw:text-[#9CA3AF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 21" fill="none" aria-hidden="true" className="tw:block tw:shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M15 3.83332H15.8333C16.75 3.83332 17.5 4.58332 17.5 5.49999V17.1667C17.5 18.0833 16.75 18.8333 15.8333 18.8333H4.16667C3.24167 18.8333 2.5 18.0833 2.5 17.1667L2.50833 5.49999C2.50833 4.58332 3.24167 3.83332 4.16667 3.83332H5V2.16666H6.66667V3.83332H13.3333V2.16666H15V3.83332ZM4.16667 8.83332V17.1667H15.8333V8.83332H4.16667ZM15.8333 7.16666H4.16667V5.49999H15.8333V7.16666ZM14.1667 11.3333H10V15.5H14.1667V11.3333Z" fill="#9CA3AF" />
              </svg>
              {`Starts: ${start}`}
            </span>
          )}
          <span className="tw:text-[12px] tw:text-[#6B7280] tw:bg-[#F3F4F6] tw:rounded tw:px-2 tw:py-0.5 tw:whitespace-nowrap tw:ml-auto">
            {selfPaced ? 'Self-Paced' : 'Instructor-Paced'}
          </span>
        </div>
      </div>
    </a>
  );
};

CourseCard.propTypes = {
  courseUrl: PropTypes.string,
  imageUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  orgName: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.node,
  isPriced: PropTypes.bool,
  rating: PropTypes.number,
  selfPaced: PropTypes.bool,
  startDate: PropTypes.string,
};

export default CourseCard;
