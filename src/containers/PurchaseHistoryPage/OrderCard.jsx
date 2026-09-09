import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import { formatCurrency } from 'utils';
import coursePlaceholder from 'assets/course-placeholder.svg';
import { handleImageError } from 'components/CourseCard';

import messages from './messages';

// A uuid is too long to read back to support, and the first block is already
// unique enough to find the order by. The full value stays in the title.
export const shortReference = (reference) => (reference || '').split('-')[0].toUpperCase();

export const formatDate = (value) => (
  value
    ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null
);

export const OrderCard = ({ order }) => {
  const { formatMessage } = useIntl();

  const paidDate = formatDate(order.paidAt || order.placedAt);
  // Only worth breaking the figure down when a code actually moved it: without
  // one the subtotal and the total are the same number said twice.
  const hasDiscount = order.discountCentavos > 0;

  const amount = (centavos) => (
    centavos === 0 ? formatMessage(messages.free) : formatCurrency(centavos / 100, 'PHP')
  );

  return (
    <article className="order-card">
      <header className="order-card__head">
        <div className="order-card__ident">
          {paidDate && (
            <p className="order-card__date">
              {formatMessage(messages.paidOn, { date: paidDate })}
            </p>
          )}
          <p className="order-card__ref" title={order.reference}>
            {formatMessage(messages.orderReference, { reference: shortReference(order.reference) })}
          </p>
        </div>
        <div className="order-card__totals">
          <p className="order-card__total">{amount(order.totalCentavos)}</p>
          <p className="order-card__count">
            {formatMessage(messages.itemCount, { count: order.items.length })}
          </p>
        </div>
      </header>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <li className="order-line" key={item.courseId}>
            <img
              src={item.imageUrl || coursePlaceholder}
              alt=""
              onError={handleImageError}
              className="order-line__thumb"
            />
            <div className="order-line__body">
              <p className="order-line__title">{item.title}</p>
              <p className="order-line__org">{item.orgName}</p>
              {item.courseUrl ? (
                <a
                  className="order-line__link"
                  href={item.courseUrl}
                  aria-label={formatMessage(messages.goToCourseSR, { title: item.title })}
                >
                  {formatMessage(messages.goToCourse)}
                </a>
              ) : (
                <p className="order-line__gone">{formatMessage(messages.courseUnavailable)}</p>
              )}
            </div>
            <p className="order-line__price">
              {item.listPriceCentavos > 0 && (
                // What the course normally costs, struck through beside what a
                // code actually took off this line.
                <span className="order-line__was">
                  <span className="sr-only">
                    {formatMessage(messages.listPrice, {
                      amount: formatCurrency(item.listPriceCentavos / 100, 'PHP'),
                    })}
                  </span>
                  <s aria-hidden="true">{formatCurrency(item.listPriceCentavos / 100, 'PHP')}</s>
                </span>
              )}
              {amount(item.amountCentavos)}
            </p>
          </li>
        ))}
      </ul>

      {hasDiscount && (
        <footer className="order-card__foot">
          <div className="order-card__line">
            <span>{formatMessage(messages.subtotal)}</span>
            <span>{formatCurrency(order.subtotalCentavos / 100, 'PHP')}</span>
          </div>
          <div className="order-card__line order-card__line--discount">
            <span>
              {formatMessage(messages.discount)}
              {order.discountCode && (
                <span className="order-card__code">{order.discountCode}</span>
              )}
            </span>
            <span>{`-${formatCurrency(order.discountCentavos / 100, 'PHP')}`}</span>
          </div>
          <div className="order-card__line order-card__line--total">
            <span>{formatMessage(messages.total)}</span>
            <span>{amount(order.totalCentavos)}</span>
          </div>
        </footer>
      )}
    </article>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    reference: PropTypes.string.isRequired,
    placedAt: PropTypes.string,
    paidAt: PropTypes.string,
    subtotalCentavos: PropTypes.number,
    discountCode: PropTypes.string,
    discountCentavos: PropTypes.number,
    totalCentavos: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      title: PropTypes.string,
      orgName: PropTypes.string,
      imageUrl: PropTypes.string,
      courseUrl: PropTypes.string,
      amountCentavos: PropTypes.number,
      listPriceCentavos: PropTypes.number,
    })).isRequired,
  }).isRequired,
};

export default OrderCard;
