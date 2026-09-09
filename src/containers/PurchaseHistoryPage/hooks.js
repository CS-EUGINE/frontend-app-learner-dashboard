import React from 'react';

import { logError } from '@edx/frontend-platform/logging';

import api from 'data/services/lms/api';

// Orders per page. Small on purpose: an order is a tall card, and five of them
// already fill a screen.
export const ORDERS_PER_PAGE = 5;

/**
 * usePurchaseHistory()
 * Loads the learner's paid orders, newest first, and totals them for the
 * summary line. The server is the only thing that decides what counts as a
 * purchase, so nothing is filtered here.
 *
 * Paging is done here rather than by the server: a learner's whole history is
 * a handful of rows, and holding it all lets the summary total every order
 * while the list shows one page. If this ever grows past a few hundred orders,
 * the endpoint is the place to move it to.
 */
export const usePurchaseHistory = () => {
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let cancelled = false;
    api.fetchCartOrders()
      .then(({ data }) => {
        if (!cancelled) {
          setOrders(data.orders || []);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        logError(error);
        if (!cancelled) {
          setLoadError(true);
          setIsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const courseCount = orders.reduce((sum, order) => sum + order.items.length, 0);
  const spentCentavos = orders.reduce((sum, order) => sum + order.totalCentavos, 0);

  const pageCount = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  // Clamped rather than trusted: the fetch lands after the first render, so
  // `page` outliving a shorter list would otherwise show an empty page.
  const currentPage = Math.min(page, pageCount);
  const pageOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  return {
    orders,
    pageOrders,
    currentPage,
    pageCount,
    setPage,
    courseCount,
    spentCentavos,
    isLoading,
    loadError,
  };
};

export default usePurchaseHistory;
