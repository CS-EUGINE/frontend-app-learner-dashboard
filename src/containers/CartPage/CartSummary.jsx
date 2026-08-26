import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form, Icon } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';

import { formatCurrency } from 'utils';
import messages from './messages';

export const CartSummary = ({
  count,
  subtotalCentavos,
  discount,
  discountCentavos,
  discountError,
  totalCentavos,
  isApplyingDiscount,
  isCheckingOut,
  isDisabled,
  onApplyDiscount,
  onRemoveDiscount,
  onCheckout,
}) => {
  const { formatMessage } = useIntl();
  // The field is uncontrolled until a code sticks: the applied code is shown as
  // a chip instead, so there is never a stale string sitting in an input next
  // to a different code in the summary.
  const [draftCode, setDraftCode] = React.useState('');

  const subtotal = subtotalCentavos / 100;
  const total = totalCentavos / 100;
  const isFree = totalCentavos === 0 && count > 0;
  const partialCount = discount ? discount.eligibleCourseIds.length : 0;

  const submitCode = (event) => {
    event.preventDefault();
    onApplyDiscount(draftCode);
  };

  const removeCode = () => {
    setDraftCode('');
    onRemoveDiscount();
  };

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__label">{formatMessage(messages.promotions)}</h2>

      {discount ? (
        <div className="cart-summary__coupon-applied">
          <Icon src={CheckCircle} className="cart-summary__coupon-tick" />
          <div className="cart-summary__coupon-detail">
            <span className="cart-summary__coupon-code">
              {formatMessage(messages.couponApplied, { code: discount.code })}
            </span>
            {partialCount > 0 && partialCount < count && (
              <span className="cart-summary__coupon-scope">
                {formatMessage(messages.couponPartial, { count: partialCount })}
              </span>
            )}
          </div>
          <Button variant="link" size="sm" onClick={removeCode}>
            {formatMessage(messages.couponRemove)}
          </Button>
        </div>
      ) : (
        <form className="cart-summary__coupon" onSubmit={submitCode}>
          <Form.Control
            size="sm"
            value={draftCode}
            onChange={(event) => setDraftCode(event.target.value)}
            placeholder={formatMessage(messages.couponPlaceholder)}
            aria-label={formatMessage(messages.couponPlaceholder)}
            isInvalid={Boolean(discountError)}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isApplyingDiscount || !draftCode.trim() || count === 0}
          >
            {isApplyingDiscount
              ? formatMessage(messages.couponApplying)
              : formatMessage(messages.couponApply)}
          </Button>
        </form>
      )}

      {discountError ? (
        <p className="cart-summary__coupon-error" role="alert">{discountError}</p>
      ) : (
        <p className="cart-summary__coupon-note">{formatMessage(messages.couponHint)}</p>
      )}

      <div className="cart-summary__panel">
        <h2 className="cart-summary__title">{formatMessage(messages.summary)}</h2>

        <div className="cart-summary__line">
          <span>{formatMessage(messages.subtotal, { count })}</span>
          <span>{formatCurrency(subtotal, 'PHP')}</span>
        </div>
        <div className="cart-summary__line">
          <span>{formatMessage(messages.promo)}</span>
          <span className={discountCentavos ? 'cart-summary__discount' : undefined}>
            {discountCentavos ? `-${formatCurrency(discountCentavos / 100, 'PHP')}` : '0'}
          </span>
        </div>

        <div className="cart-summary__line cart-summary__line--total">
          <span>{formatMessage(messages.total)}</span>
          <span>{formatCurrency(total, 'PHP')}</span>
        </div>
      </div>

      <Button
        variant="primary"
        className="cart-summary__checkout"
        disabled={isDisabled}
        onClick={onCheckout}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {isCheckingOut
          ? formatMessage(messages.checkoutPending)
          : (isFree
            ? formatMessage(messages.enrollFree)
            : formatMessage(messages.checkout))}
      </Button>

      <p className="cart-summary__note">
        {isFree
          ? formatMessage(messages.freeOrderNote)
          : formatMessage(messages.paymentNote)}
      </p>
    </aside>
  );
};

CartSummary.propTypes = {
  count: PropTypes.number.isRequired,
  subtotalCentavos: PropTypes.number.isRequired,
  discount: PropTypes.shape({
    code: PropTypes.string.isRequired,
    eligibleCourseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  discountCentavos: PropTypes.number,
  discountError: PropTypes.string,
  totalCentavos: PropTypes.number.isRequired,
  isApplyingDiscount: PropTypes.bool,
  isCheckingOut: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onApplyDiscount: PropTypes.func.isRequired,
  onRemoveDiscount: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
};

CartSummary.defaultProps = {
  discount: null,
  discountCentavos: 0,
  discountError: '',
  isApplyingDiscount: false,
  isCheckingOut: false,
  isDisabled: false,
};

export default CartSummary;
