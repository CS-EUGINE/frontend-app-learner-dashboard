import React from 'react';

import { logError } from '@edx/frontend-platform/logging';

import api from 'data/services/lms/api';

export const emptyCart = {
  items: [],
  itemCount: 0,
  total: 0,
  totalCentavos: 0,
  currency: 'PHP',
};

/**
 * useCartData()
 * Loads the cart and exposes the mutations the page needs. The API returns the
 * full cart on every mutation, so each response replaces local state outright
 * and the two can never drift apart.
 *
 * Selection is tracked here too: courses are all selected by default, and only
 * the selected ones are priced into the summary and sent to checkout.
 */
export const useCartData = () => {
  const [cart, setCart] = React.useState(emptyCart);
  const [selected, setSelected] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState(false);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [pendingCourseId, setPendingCourseId] = React.useState(null);
  // Courses enrolled by confirming a payment on return from Paymongo, or by an
  // order a discount code took to zero.
  const [fulfilledCourses, setFulfilledCourses] = React.useState([]);
  // The applied discount, as the server priced it. Only one at a time: the
  // field is replaced, never accumulated.
  const [discount, setDiscount] = React.useState(null);
  const [discountCode, setDiscountCode] = React.useState('');
  const [discountError, setDiscountError] = React.useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = React.useState(false);

  // Keep every course in the cart selected unless the learner unticks it, and
  // drop ids that are no longer present after a removal.
  const syncCart = React.useCallback((data) => {
    const ids = data.items.map(item => item.courseId);
    setCart(data);
    setSelected(prev => (
      prev.length === 0
        ? ids
        : ids.filter(id => prev.includes(id))
    ));
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const loadCart = () => api.fetchCart()
      .then(({ data }) => {
        if (!cancelled) {
          setCart(data);
          setSelected(data.items.map(item => item.courseId));
          setIsLoading(false);
        }
      });

    // Paymongo returns the learner here either way: ?payment=success after
    // paying, ?payment=cancelled if they backed out. Both are reconciled with
    // the backend before the cart loads — success so enrollment happens even
    // when the webhook never arrived, cancelled so the abandoned order lets go
    // of the discount code it was holding.
    const paymentReturn = new URLSearchParams(global.location.search).get('payment');
    const returnedFromPayment = paymentReturn === 'success' || paymentReturn === 'cancelled';

    const start = returnedFromPayment
      ? api.verifyCartPayment()
        .then(({ data }) => {
          if (!cancelled && data.fulfilledCount > 0) {
            setFulfilledCourses(data.courses);
          }
        })
        .catch((error) => {
          // A verification failure must not block the cart from rendering.
          logError(error);
        })
      : Promise.resolve();

    start
      .then(loadCart)
      .catch((error) => {
        logError(error);
        if (!cancelled) {
          setLoadError(true);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const toggleSelected = React.useCallback((courseId) => {
    setSelected(prev => (
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    ));
  }, []);

  const applyDiscount = React.useCallback((rawCode) => {
    const code = (rawCode || '').trim();
    if (!code) { return; }
    setIsApplyingDiscount(true);
    setDiscountError('');
    api.previewCartDiscount({ code, courseIds: selected })
      .then(({ data }) => {
        if (data.valid) {
          setDiscount(data);
          setDiscountCode(data.code);
        } else {
          // An unrecognised or spent code is an expected outcome of typing in
          // the box, so the server answers 200 with the reason to show.
          setDiscount(null);
          setDiscountError(data.error);
        }
      })
      .catch((error) => {
        logError(error);
        setDiscount(null);
        setDiscountError(error?.response?.data?.error || 'That code could not be applied right now.');
      })
      .finally(() => setIsApplyingDiscount(false));
  }, [selected]);

  const removeDiscount = React.useCallback(() => {
    setDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  }, []);

  // A discount is priced against a specific set of courses, so unticking one
  // makes the applied figure wrong. Re-quote instead of leaving a stale number
  // on screen, and drop the code if it no longer covers anything selected.
  const appliedCode = discount?.code;
  React.useEffect(() => {
    if (!appliedCode) { return undefined; }
    // Nothing selected is not a code problem — the summary is empty anyway, so
    // drop the discount quietly rather than reporting it as a failure.
    if (selected.length === 0) { setDiscount(null); return undefined; }
    let cancelled = false;
    api.previewCartDiscount({ code: appliedCode, courseIds: selected })
      .then(({ data }) => {
        if (cancelled) { return; }
        if (data.valid) {
          setDiscount(data);
        } else {
          setDiscount(null);
          setDiscountError(data.error);
        }
      })
      .catch((error) => {
        if (cancelled) { return; }
        logError(error);
        setDiscount(null);
        setDiscountError('That code no longer applies to what you have selected.');
      });
    return () => { cancelled = true; };
  }, [appliedCode, selected]);

  const removeItem = React.useCallback((courseId) => {
    setPendingCourseId(courseId);
    api.removeCartItem({ courseId })
      .then(({ data }) => syncCart(data))
      .catch((error) => {
        logError(error);
        setLoadError(true);
      })
      .finally(() => setPendingCourseId(null));
  }, [syncCart]);

  const clear = React.useCallback(() => {
    setPendingCourseId('all');
    api.clearCart()
      .then(({ data }) => {
        setCart(data);
        setSelected([]);
        setDiscount(null);
        setDiscountCode('');
        setDiscountError('');
      })
      .catch((error) => {
        logError(error);
        setLoadError(true);
      })
      .finally(() => setPendingCourseId(null));
  }, []);

  const checkout = React.useCallback(() => {
    setCheckoutError(false);
    setIsCheckingOut(true);
    api.checkoutCart({ courseIds: selected, discountCode: discount?.code })
      .then(({ data }) => {
        if (data.fulfilled) {
          // A code worth the whole order leaves nothing to charge, so the
          // server enrolled the learner instead of sending them to Paymongo.
          setFulfilledCourses(data.courses);
          removeDiscount();
          setIsCheckingOut(false);
          return api.fetchCart().then(({ data: refreshed }) => {
            setCart(refreshed);
            setSelected(refreshed.items.map(item => item.courseId));
          });
        }
        // Leave the button in its pending state; the browser is on its way out.
        window.location.assign(data.checkoutUrl);
        return undefined;
      })
      .catch((error) => {
        logError(error);
        // A code that ran out between preview and checkout is the learner's
        // problem to fix, not a generic failure, so say which one it was.
        if (error?.response?.data?.discountRejected) {
          setDiscount(null);
          setDiscountError(error.response.data.error);
        } else {
          setCheckoutError(true);
        }
        setIsCheckingOut(false);
      });
  }, [selected, discount, removeDiscount]);

  const selectedItems = cart.items.filter(item => selected.includes(item.courseId));
  const subtotalCentavos = selectedItems.reduce((sum, item) => sum + item.amountCentavos, 0);
  const discountCentavos = discount ? discount.discountCentavos : 0;
  // Clamped rather than trusted: a discount quoted a moment ago against a
  // larger selection must never render as a negative total while the re-quote
  // above is still in flight.
  const totalCentavos = Math.max(subtotalCentavos - discountCentavos, 0);

  return {
    cart,
    selected,
    selectedItems,
    subtotalCentavos,
    discount,
    discountCode,
    discountCentavos,
    discountError,
    totalCentavos,
    isApplyingDiscount,
    fulfilledCourses,
    isLoading,
    loadError,
    checkoutError,
    isCheckingOut,
    pendingCourseId,
    toggleSelected,
    applyDiscount,
    removeDiscount,
    removeItem,
    clear,
    checkout,
  };
};

export default useCartData;
