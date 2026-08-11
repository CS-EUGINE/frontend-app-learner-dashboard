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
  // Courses enrolled by confirming a payment on return from Paymongo.
  const [fulfilledCourses, setFulfilledCourses] = React.useState([]);

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

    // Paymongo returns the learner here with ?payment=success. Confirm the
    // payment with the backend before loading the cart, so enrollment happens
    // even if the webhook never arrived.
    const returnedFromPayment = new URLSearchParams(global.location.search).get('payment') === 'success';

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
    api.checkoutCart({ courseIds: selected })
      .then(({ data }) => {
        // Leave the button in its pending state; the browser is on its way out.
        window.location.assign(data.checkoutUrl);
      })
      .catch((error) => {
        logError(error);
        setCheckoutError(true);
        setIsCheckingOut(false);
      });
  }, [selected]);

  const selectedItems = cart.items.filter(item => selected.includes(item.courseId));
  const subtotalCentavos = selectedItems.reduce((sum, item) => sum + item.amountCentavos, 0);

  return {
    cart,
    selected,
    selectedItems,
    subtotalCentavos,
    fulfilledCourses,
    isLoading,
    loadError,
    checkoutError,
    isCheckingOut,
    pendingCourseId,
    toggleSelected,
    removeItem,
    clear,
    checkout,
  };
};

export default useCartData;
