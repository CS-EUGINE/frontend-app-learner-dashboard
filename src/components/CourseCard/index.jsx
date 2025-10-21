import StarRating from '../StarRating';

const CourseCard = ({
  courseUrl = '#',
  imageUrl,
  title,
  description,
  price,
  rating,
  selfPaced,
}) => {
  const handleOnClick = () => {
    window.location.href = courseUrl;
  };

  return (
    <div className="tw:bg-white tw:shadow-md tw:rounded-lg tw:overflow-hidden tw:cursor-pointer" onClick={() => handleOnClick()}>
      <div className="tw:relative tw:w-full tw:h-60">
        {/* Badge */}
        <div className="tw:absolute tw:top-3 tw:left-3 tw:bg-[#69AF79] tw:text-white tw:rounded-full tw:w-10 tw:h-10 tw:flex tw:items-center tw:justify-center tw:text-sm tw:font-bold tw-shadow-lg tw:z-10">
          {price}
        </div>
        <img
          src={imageUrl}
          alt={title}
          className="tw:w-full tw:h-full tw:object-cover"
        />
        <div
          className="tw:absolute tw:inset-0 tw:bg-[#727175] tw:opacity-40"
          style={{
            clipPath: "polygon(0 0, 100% 0px, 100% 65%, 70% 100%, 100% 65%, 0px 105%)"
          }}
        ></div>
      </div>
      
      <div className="tw:px-6 tw:pb-2 tw:pt-4">
        <h3 className="tw:text-xl tw:text-center tw:font-bold tw:text-[#6255A1] tw:mb-2">
          {title}
        </h3>
        <p className="tw:text-gray-600 tw:text-sm tw:mb-4">
          {description}
        </p>
      </div>

      <footer className="tw:flex tw:flex-col tw:px-6 tw:pb-6">
        <div className='tw:flex tw:space-x-2 tw:items-center tw:text-center'>
          <StarRating max={5} value={rating} disabled />
          <span>|</span>
          <p className='tw:mb-0'>
            {`${rating} Reviews`}
          </p>
        </div>

        <small className='tw:text-grey-neutral'>{selfPaced ? 'Self-Paced' : 'Instructor-Paced'}</small>
      </footer>
    </div>
  );
}

export default CourseCard;