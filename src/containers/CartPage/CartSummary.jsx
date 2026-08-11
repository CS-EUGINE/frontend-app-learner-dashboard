import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form } from '@openedx/paragon';

import { formatCurrency } from './CartItemRow';
import messages from './messages';

export const CartSummary = ({
  count, subtotalCentavos, isCheckingOut, isDisabled, onCheckout,
}) => {
  const { formatMessage } = useIntl();
  const subtotal = subtotalCentavos / 100;

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__label">{formatMessage(messages.promotions)}</h2>
      <div className="cart-summary__coupon">
        <Form.Control
          size="sm"
          disabled
          placeholder={formatMessage(messages.couponPlaceholder)}
          aria-label={formatMessage(messages.couponPlaceholder)}
        />
        <Button variant="primary" size="sm" disabled>
          {formatMessage(messages.couponApply)}
        </Button>
      </div>
      <p className="cart-summary__coupon-note">
        {formatMessage(messages.couponUnavailable)}
      </p>

      <div className="cart-summary__panel">
        <h2 className="cart-summary__title">{formatMessage(messages.summary)}</h2>

        <div className="cart-summary__line">
          <span>{formatMessage(messages.subtotal, { count })}</span>
          <span>{formatCurrency(subtotal, 'PHP')}</span>
        </div>
        <div className="cart-summary__line">
          <span>{formatMessage(messages.promo)}</span>
          <span>0</span>
        </div>

        <div className="cart-summary__line cart-summary__line--total">
          <span>{formatMessage(messages.total)}</span>
          <span>{formatCurrency(subtotal, 'PHP')}</span>
        </div>
      </div>

      <Button
        variant="primary"
        className="cart-summary__checkout"
        disabled={isDisabled}
        onClick={onCheckout}
      >
        {isCheckingOut
          ? formatMessage(messages.checkoutPending)
          : formatMessage(messages.checkout)}
      </Button>

      <p className="cart-summary__note">{formatMessage(messages.paymentNote)}</p>
    </aside>
  );
};

CartSummary.propTypes = {
  count: PropTypes.number.isRequired,
  subtotalCentavos: PropTypes.number.isRequired,
  isCheckingOut: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onCheckout: PropTypes.func.isRequired,
};

CartSummary.defaultProps = {
  isCheckingOut: false,
  isDisabled: false,
};

export default CartSummary;
