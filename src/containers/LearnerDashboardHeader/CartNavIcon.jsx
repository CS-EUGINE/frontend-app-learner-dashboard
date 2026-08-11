import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@openedx/paragon';
import { ShoppingCart } from '@openedx/paragon/icons';

/**
 * Cart icon for the header's right-hand secondary menu, with a count badge.
 * The badge is hidden when the cart is empty.
 */
export const CartNavIcon = ({ count, label }) => (
  <span className="cart-nav-icon" aria-label={label} role="img">
    <Icon src={ShoppingCart} />
    {count > 0 && (
      <span className="cart-nav-icon__badge" aria-hidden="true">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </span>
);

CartNavIcon.propTypes = {
  count: PropTypes.number,
  label: PropTypes.string.isRequired,
};

CartNavIcon.defaultProps = {
  count: 0,
};

export default CartNavIcon;
