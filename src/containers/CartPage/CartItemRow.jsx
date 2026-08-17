import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import { formatCurrency } from 'utils';
import coursePlaceholder from 'assets/course-placeholder.svg';
import { handleImageError } from 'components/CourseCard';

import messages from './messages';

export const CartItemRow = ({
  item, isSelected, isPending, onToggle, onRemove,
}) => {
  const { formatMessage } = useIntl();

  const start = item.startDate ? new Date(item.startDate) : null;
  const hasStarted = start ? start <= new Date() : false;
  const startLabel = start
    ? `${formatMessage(hasStarted ? messages.started : messages.starts)} · ${start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`
    : null;

  return (
    <div className="cart-row">
      <Form.Checkbox
        className="cart-row__check"
        checked={isSelected}
        disabled={isPending}
        onChange={() => onToggle(item.courseId)}
      >
        <span className="sr-only">
          {formatMessage(messages.selectSR, { title: item.title })}
        </span>
      </Form.Checkbox>

      <div className="cart-row__card">
        <img
          src={item.imageUrl || coursePlaceholder}
          alt=""
          onError={handleImageError}
          className="cart-row__thumb"
        />

        <div className="cart-row__body">
          <p className="cart-row__title">{item.title}</p>
          {item.shortDescription && (
            <p className="cart-row__desc">{item.shortDescription}</p>
          )}
          {startLabel && <p className="cart-row__date">{startLabel}</p>}
        </div>

        <div className="cart-row__aside">
          <p className="cart-row__price">
            {formatCurrency(item.amountCentavos / 100, 'PHP')}
          </p>
          <button
            type="button"
            className="cart-row__remove"
            disabled={isPending}
            onClick={() => onRemove(item.courseId)}
            aria-label={formatMessage(messages.removeSR, { title: item.title })}
          >
            {formatMessage(messages.remove)}
          </button>
        </div>
      </div>
    </div>
  );
};

CartItemRow.propTypes = {
  item: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    title: PropTypes.string,
    orgName: PropTypes.string,
    imageUrl: PropTypes.string,
    shortDescription: PropTypes.string,
    startDate: PropTypes.string,
    price: PropTypes.number,
    currency: PropTypes.string,
    amountCentavos: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool,
  isPending: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

CartItemRow.defaultProps = {
  isSelected: true,
  isPending: false,
};

export default CartItemRow;
