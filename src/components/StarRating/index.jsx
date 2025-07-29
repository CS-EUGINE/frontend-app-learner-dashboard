import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({
  max = 5,
  value = 0,
  hovered = null,
  disabled = false,
  color = '#F8B84E',
  onRate,
  onHover,
}) => {
  const safeMax = Number.isInteger(max) && max > 0 ? max : 5;
  const displayValue = hovered !== null ? hovered : value;

  const handleMouseMove = (e, starValue) => {
    if (disabled) return;
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const newHover = x < width / 2 ? starValue - 0.5 : starValue;
    onHover?.(newHover);
  };

  const handleClick = (e, starValue) => {
    if (disabled) return;
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const rateValue = x < width / 2 ? starValue - 0.5 : starValue;
    onRate?.(rateValue);
  };

  return (
    <div
      className={`tw:flex tw:space-x-1`}
    >
      {Array.from({ length: safeMax }).map((_, index) => {
        const starValue = index + 1;
        let icon;
        if (displayValue >= starValue) {
          icon = faStarSolid;
        } else if (displayValue >= starValue - 0.5) {
          icon = faStarHalfAlt;
        } else {
          icon = faStarRegular;
        }
        return (
          <button
            key={starValue}
            type="button"
            className="tw:focus:outline-none tw:bg-transparent"
            onMouseMove={(e) => handleMouseMove(e, starValue)}
            onMouseLeave={() => !disabled && onHover?.(null)}
            onClick={(e) => handleClick(e, starValue)}
            style={{
              padding: 0,
              border: "none",
              background: "none",
              cursor: disabled ? "default" : "pointer",
            }}
            aria-label={`Rate ${starValue}${starValue === 1 ? " star" : " stars"}`}
            disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            title={starValue}
          >
            <FontAwesomeIcon icon={icon} color={color} />
          </button>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  max: PropTypes.number,
  value: PropTypes.number,
  hovered: PropTypes.number,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  onRate: PropTypes.func,
  onHover: PropTypes.func,
};

export default StarRating;
