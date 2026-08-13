import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'learner-dash.cart.pageTitle',
    description: 'Browser tab title for the shopping cart page',
    defaultMessage: 'Shopping Cart',
  },
  heading: {
    id: 'learner-dash.cart.heading',
    description: 'Heading of the shopping cart page',
    defaultMessage: 'Shopping Cart',
  },
  itemCount: {
    id: 'learner-dash.cart.itemCount',
    description: 'Number of courses currently in the cart',
    defaultMessage: '{count, plural, one {# course} other {# courses}}',
  },
  emptyTitle: {
    id: 'learner-dash.cart.emptyTitle',
    description: 'Title shown when the cart has no courses in it',
    defaultMessage: 'Your cart is empty',
  },
  emptyBody: {
    id: 'learner-dash.cart.emptyBody',
    description: 'Body text shown when the cart has no courses in it',
    defaultMessage: 'Browse the course catalog and add a course to get started.',
  },
  backToDashboard: {
    id: 'learner-dash.cart.backToDashboard',
    description: 'Link back to the learner dashboard',
    defaultMessage: 'Back to dashboard',
  },
  remove: {
    id: 'learner-dash.cart.remove',
    description: 'Link that removes one course from the cart',
    defaultMessage: 'Remove',
  },
  removeSR: {
    id: 'learner-dash.cart.removeSR',
    description: 'Screen-reader label for the remove link',
    defaultMessage: 'Remove {title} from your cart',
  },
  selectSR: {
    id: 'learner-dash.cart.selectSR',
    description: 'Screen-reader label for the per-course selection checkbox',
    defaultMessage: 'Include {title} in checkout',
  },
  started: {
    id: 'learner-dash.cart.started',
    description: 'Course start date on a cart row',
    defaultMessage: 'Started',
  },
  starts: {
    id: 'learner-dash.cart.starts',
    description: 'Course start date on a cart row, for a course starting later',
    defaultMessage: 'Starts',
  },
  clearCart: {
    id: 'learner-dash.cart.clearCart',
    description: 'Button that removes every course from the cart',
    defaultMessage: 'Clear cart',
  },
  promotions: {
    id: 'learner-dash.cart.promotions',
    description: 'Heading for the coupon area',
    defaultMessage: 'Promotions',
  },
  couponPlaceholder: {
    id: 'learner-dash.cart.couponPlaceholder',
    description: 'Placeholder in the coupon code field',
    defaultMessage: 'Enter Coupon',
  },
  couponApply: {
    id: 'learner-dash.cart.couponApply',
    description: 'Button that applies a coupon code',
    defaultMessage: 'Apply',
  },
  couponUnavailable: {
    id: 'learner-dash.cart.couponUnavailable',
    description: 'Note explaining that coupon codes are not enabled',
    defaultMessage: 'Coupon codes are not enabled yet.',
  },
  summary: {
    id: 'learner-dash.cart.summary',
    description: 'Heading of the order summary panel',
    defaultMessage: 'Summary',
  },
  subtotal: {
    id: 'learner-dash.cart.subtotal',
    description: 'Subtotal row in the order summary',
    defaultMessage: 'Subtotal ({count, plural, one {# Course} other {# Courses}}):',
  },
  promo: {
    id: 'learner-dash.cart.promo',
    description: 'Promotional discount row in the order summary',
    defaultMessage: 'Promo:',
  },
  total: {
    id: 'learner-dash.cart.total',
    description: 'Total row in the order summary',
    defaultMessage: 'Total:',
  },
  checkout: {
    id: 'learner-dash.cart.checkout',
    description: 'Button that sends the learner to the Paymongo payment page',
    defaultMessage: 'Checkout',
  },
  checkoutPending: {
    id: 'learner-dash.cart.checkoutPending',
    description: 'Button label while the payment session is being created',
    defaultMessage: 'Redirecting...',
  },
  loading: {
    id: 'learner-dash.cart.loading',
    description: 'Screen-reader text while the cart is loading',
    defaultMessage: 'Loading your cart',
  },
  loadError: {
    id: 'learner-dash.cart.loadError',
    description: 'Error shown when the cart could not be loaded',
    defaultMessage: 'We could not load your cart. Please refresh the page and try again.',
  },
  checkoutError: {
    id: 'learner-dash.cart.checkoutError',
    description: 'Error shown when the payment session could not be created',
    defaultMessage: 'We could not start your payment. Please try again in a moment.',
  },
  nothingSelected: {
    id: 'learner-dash.cart.nothingSelected',
    description: 'Message shown when the learner has deselected every course',
    defaultMessage: 'Select at least one course to check out.',
  },
  paymentConfirmedTitle: {
    id: 'learner-dash.cart.paymentConfirmedTitle',
    description: 'Heading of the banner shown after a payment is confirmed',
    defaultMessage: 'Payment confirmed',
  },
  paymentConfirmedBody: {
    id: 'learner-dash.cart.paymentConfirmedBody',
    description: 'Banner listing the courses the learner was just enrolled in',
    defaultMessage: 'You are now enrolled in {courses}.',
  },
  goToDashboard: {
    id: 'learner-dash.cart.goToDashboard',
    description: 'Link to the dashboard after a successful payment',
    defaultMessage: 'Go to my courses',
  },
  paymentNote: {
    id: 'learner-dash.cart.paymentNote',
    description: 'Note explaining what happens after payment',
    defaultMessage: 'You will be redirected to Paymongo to pay. Your courses unlock as soon as the payment is confirmed.',
  },
});

export default messages;
