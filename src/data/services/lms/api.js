import eventNames from 'tracking/constants';
import {
  client,
  get,
  post,
  stringifyUrl,
} from './utils';
import {
  apiKeys,
  unenrollmentAction,
  enableEmailsAction,
} from './constants';
import urls from './urls';
import * as module from './api';

/*********************************************************************************
 * GET Actions
 *********************************************************************************/
export const initializeList = ({ user } = {}) => get(
  stringifyUrl(urls.getInitApiUrl(), { [apiKeys.user]: user }),
);

export const fetchCourseCatalog = () => get(urls.courseCatalogUrl());

export const fetchAnnouncements = () => get(urls.announcementsUrl());

export const updateEntitlementEnrollment = ({ uuid, courseId }) => post(
  urls.entitlementEnrollment(uuid),
  { [apiKeys.courseRunId]: courseId },
);

export const deleteEntitlementEnrollment = ({ uuid, isRefundable }) => client()
  .delete(
    stringifyUrl(
      urls.entitlementEnrollment(uuid),
      { [apiKeys.isRefund]: isRefundable },
    ),
  );

export const updateEmailSettings = ({ courseId, enable }) => post(
  urls.updateEmailSettings(),
  { [apiKeys.courseId]: courseId, ...(enable && enableEmailsAction) },
);

export const unenrollFromCourse = ({ courseId }) => post(
  urls.courseUnenroll(),
  { [apiKeys.courseId]: courseId, ...unenrollmentAction },
);

export const logEvent = ({ eventName, data, courseId }) => post(urls.event(), {
  courserun_key: courseId,
  event_type: eventName,
  page: window.location.href,
  event: JSON.stringify(data),
});

export const logUpgrade = ({ courseId }) => module.logEvent({
  eventName: eventNames.upgradeButtonClickedEnrollment,
  courseId,
  data: { location: 'learner-dashboard' },
});

export const logShare = ({ courseId, site }) => module.logEvent({
  eventName: eventNames.shareClicked,
  courseId,
  data: {
    course_id: courseId,
    social_media_site: site,
    location: 'dashboard',
  },
});

export const createCreditRequest = ({ providerId, courseId, username }) => post(
  urls.creditRequestUrl(providerId),
  { course_key: courseId, username },
);

/*********************************************************************************
 * Shopping cart
 *********************************************************************************/
export const fetchCart = () => get(urls.cartUrl());

export const addCartItem = ({ courseId }) => post(
  urls.cartItemsUrl(),
  { [apiKeys.courseId]: courseId },
);

export const removeCartItem = ({ courseId }) => client()
  .delete(urls.cartItemUrl(encodeURIComponent(courseId)));

export const clearCart = () => client().delete(urls.cartUrl());

/*********************************************************************************
 * Course approval
 *********************************************************************************/
export const fetchAuthoredCourses = () => get(urls.authoredCoursesUrl());

/*********************************************************************************
 * Course feedback
 *********************************************************************************/
// Every review this learner has already written, fetched once for the whole
// dashboard so a card can tell whether its course is done without a request of
// its own.
export const fetchCourseFeedback = () => get(urls.courseFeedbackUrl());

/*********************************************************************************
 * Notifications
 *********************************************************************************/
export const fetchNotifications = () => get(urls.notificationsUrl());

// `ids` omitted means "everything unread", which is what Mark all read sends.
export const markNotificationsRead = ({ ids } = {}) => post(
  urls.notificationsReadUrl(),
  ids ? { ids } : {},
);

// Refused server-side with 409 if this learner already reviewed the course:
// one review per course is the rule, and the browser is not where it is kept.
export const postCourseFeedback = ({
  courseId,
  rating,
  headline,
  comment,
  wouldRecommend,
}) => post(urls.courseFeedbackUrl(), {
  course_id: courseId,
  rating,
  headline,
  comment,
  would_recommend: wouldRecommend,
});

export const verifyCartPayment = () => post(urls.cartVerifyUrl(), {});

// Prices a code against the current selection without spending a use, so the
// cart can preview it on every Apply. The code is sent again with the checkout,
// which re-quotes it server-side rather than trusting the preview.
export const previewCartDiscount = ({ code, courseIds } = {}) => post(
  urls.cartDiscountUrl(),
  {
    code,
    ...(courseIds && courseIds.length ? { course_ids: courseIds } : {}),
  },
);

export const checkoutCart = ({ courseIds, discountCode } = {}) => post(
  urls.cartCheckoutUrl(),
  {
    ...(courseIds && courseIds.length ? { course_ids: courseIds } : {}),
    ...(discountCode ? { discount_code: discountCode } : {}),
  },
);

export default {
  initializeList,
  fetchCourseCatalog,
  fetchAnnouncements,
  unenrollFromCourse,
  updateEmailSettings,
  updateEntitlementEnrollment,
  deleteEntitlementEnrollment,
  logEvent,
  logUpgrade,
  logShare,
  createCreditRequest,
  fetchCart,
  addCartItem,
  removeCartItem,
  clearCart,
  previewCartDiscount,
  checkoutCart,
  verifyCartPayment,
  fetchAuthoredCourses,
  fetchCourseFeedback,
  postCourseFeedback,
  fetchNotifications,
  markNotificationsRead,
};
