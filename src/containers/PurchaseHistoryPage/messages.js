import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'learner-dash.purchases.pageTitle',
    description: 'Browser tab title for the purchase history page',
    defaultMessage: 'Purchase History',
  },
  heading: {
    id: 'learner-dash.purchases.heading',
    description: 'Heading of the purchase history page',
    defaultMessage: 'Purchase History',
  },
  crumbDashboard: {
    id: 'learner-dash.purchases.crumbDashboard',
    description: 'Breadcrumb link back to the learner dashboard',
    defaultMessage: 'Dashboard',
  },
  crumbCart: {
    id: 'learner-dash.purchases.crumbCart',
    description: 'Breadcrumb link back to the shopping cart',
    defaultMessage: 'Shopping Cart',
  },
  crumbCurrent: {
    id: 'learner-dash.purchases.crumbCurrent',
    description: 'Breadcrumb label for the page currently being viewed',
    defaultMessage: 'Purchase History',
  },
  breadcrumbLabel: {
    id: 'learner-dash.purchases.breadcrumbLabel',
    description: 'Accessible label for the breadcrumb navigation',
    defaultMessage: 'Breadcrumb',
  },
  backToCart: {
    id: 'learner-dash.purchases.backToCart',
    description: 'Button that returns the learner to the shopping cart',
    defaultMessage: 'Back to cart',
  },
  summary: {
    id: 'learner-dash.purchases.summary',
    description: 'Line summarising how many orders and courses the learner has paid for',
    defaultMessage: '{orders, plural, one {# order} other {# orders}} · {courses, plural, one {# course} other {# courses}} · {total} paid',
  },
  loading: {
    id: 'learner-dash.purchases.loading',
    description: 'Screen reader text while the purchase history is loading',
    defaultMessage: 'Loading your purchases',
  },
  loadError: {
    id: 'learner-dash.purchases.loadError',
    description: 'Message shown when the purchase history could not be loaded',
    defaultMessage: 'We could not load your purchases. Please refresh the page and try again.',
  },
  emptyTitle: {
    id: 'learner-dash.purchases.emptyTitle',
    description: 'Title shown when the learner has never bought a course',
    defaultMessage: 'No purchases yet',
  },
  emptyBody: {
    id: 'learner-dash.purchases.emptyBody',
    description: 'Body text shown when the learner has never bought a course',
    defaultMessage: 'Courses you buy will appear here, with what you paid and when.',
  },
  emptyAction: {
    id: 'learner-dash.purchases.emptyAction',
    description: 'Button on the empty purchase history, leading to the cart',
    defaultMessage: 'Go to your cart',
  },
  paginationLabel: {
    id: 'learner-dash.purchases.paginationLabel',
    description: 'Accessible label for the purchase history pager',
    defaultMessage: 'Purchase history pages',
  },
  previousPage: {
    id: 'learner-dash.purchases.previousPage',
    description: 'Pager button leading to the previous page of purchases',
    defaultMessage: 'Previous',
  },
  nextPage: {
    id: 'learner-dash.purchases.nextPage',
    description: 'Pager button leading to the next page of purchases',
    defaultMessage: 'Next',
  },
  page: {
    id: 'learner-dash.purchases.page',
    description: 'Word used in the pager button labels, as in "Page 2"',
    defaultMessage: 'Page',
  },
  currentPage: {
    id: 'learner-dash.purchases.currentPage',
    description: 'Said of the pager button for the page being viewed',
    defaultMessage: 'Current Page',
  },
  pageOfCount: {
    id: 'learner-dash.purchases.pageOfCount',
    description: 'Word separating the current page from the page count, as in "Page 1 of 3"',
    defaultMessage: 'of',
  },
  listPrice: {
    id: 'learner-dash.purchases.listPrice',
    description: 'Screen reader label for the price a course had before a discount code',
    defaultMessage: 'Usual price {amount}',
  },
  orderReference: {
    id: 'learner-dash.purchases.orderReference',
    description: 'Short order number shown on a purchase',
    defaultMessage: 'Order {reference}',
  },
  paidOn: {
    id: 'learner-dash.purchases.paidOn',
    description: 'Date a purchase was paid for',
    defaultMessage: 'Paid on {date}',
  },
  itemCount: {
    id: 'learner-dash.purchases.itemCount',
    description: 'How many courses are on one order',
    defaultMessage: '{count, plural, one {# course} other {# courses}}',
  },
  goToCourse: {
    id: 'learner-dash.purchases.goToCourse',
    description: 'Link from a purchased course to that course',
    defaultMessage: 'Go to course',
  },
  goToCourseSR: {
    id: 'learner-dash.purchases.goToCourseSR',
    description: 'Screen reader label for the link to a purchased course',
    defaultMessage: 'Go to {title}',
  },
  courseUnavailable: {
    id: 'learner-dash.purchases.courseUnavailable',
    description: 'Shown in place of a course link when the course no longer exists',
    defaultMessage: 'No longer available',
  },
  subtotal: {
    id: 'learner-dash.purchases.subtotal',
    description: 'Order subtotal before any discount',
    defaultMessage: 'Subtotal',
  },
  discount: {
    id: 'learner-dash.purchases.discount',
    description: 'Discount taken off an order',
    defaultMessage: 'Discount',
  },
  total: {
    id: 'learner-dash.purchases.total',
    description: 'What the learner was actually charged for an order',
    defaultMessage: 'Total paid',
  },
  free: {
    id: 'learner-dash.purchases.free',
    description: 'Amount shown for an order a discount code took to zero',
    defaultMessage: 'Free',
  },
});

export default messages;
