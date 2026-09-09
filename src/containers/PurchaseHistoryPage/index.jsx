import React from 'react';
import { Helmet } from 'react-helmet';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Button, Icon, Pagination, Spinner,
} from '@openedx/paragon';
import { Receipt } from '@openedx/paragon/icons';
import FooterSlot from '@openedx/frontend-slot-footer';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';

import { formatCurrency } from 'utils';

import OrderCard from './OrderCard';
import { usePurchaseHistory } from './hooks';
import messages from './messages';
import './index.scss';

export const PurchaseHistoryPage = () => {
  const { formatMessage } = useIntl();
  const {
    orders,
    pageOrders,
    currentPage,
    pageCount,
    setPage,
    courseCount,
    spentCentavos,
    isLoading,
    loadError,
  } = usePurchaseHistory();

  const listRef = React.useRef(null);
  const cartUrl = `${getConfig().PUBLIC_PATH}cart`;
  const isEmpty = !isLoading && !loadError && orders.length === 0;

  // Turning the page leaves the reader at the bottom of the old one, so put the
  // top of the list back in view.
  const goToPage = (nextPage) => {
    setPage(nextPage);
    if (listRef.current) {
      listRef.current.scrollIntoView({ block: 'start' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div>
        <AppWrapper>
          <LearnerDashboardHeader />
          <main className="purchases-page">
            <div className="purchases-page__inner">
              <nav
                className="purchases-page__crumbs"
                aria-label={formatMessage(messages.breadcrumbLabel)}
              >
                <ol>
                  <li><a href={getConfig().PUBLIC_PATH}>{formatMessage(messages.crumbDashboard)}</a></li>
                  <li><a href={cartUrl}>{formatMessage(messages.crumbCart)}</a></li>
                  <li aria-current="page">{formatMessage(messages.crumbCurrent)}</li>
                </ol>
              </nav>

              <div className="purchases-page__header">
                <div>
                  <h1 className="purchases-page__title">{formatMessage(messages.heading)}</h1>
                  {orders.length > 0 && (
                    <p className="purchases-page__summary">
                      {formatMessage(messages.summary, {
                        orders: orders.length,
                        courses: courseCount,
                        total: formatCurrency(spentCentavos / 100, 'PHP'),
                      })}
                    </p>
                  )}
                </div>
                <Button variant="outline-primary" size="sm" href={cartUrl}>
                  {formatMessage(messages.backToCart)}
                </Button>
              </div>

              {loadError && (
                <Alert variant="danger">{formatMessage(messages.loadError)}</Alert>
              )}

              {isLoading && (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" screenReaderText={formatMessage(messages.loading)} />
                </div>
              )}

              {isEmpty && (
                <div className="purchases-page__empty">
                  <Icon src={Receipt} size="lg" className="purchases-page__empty-icon mx-auto" />
                  <h2 className="purchases-page__empty-title">{formatMessage(messages.emptyTitle)}</h2>
                  <p className="purchases-page__empty-body">{formatMessage(messages.emptyBody)}</p>
                  <Button variant="outline-primary" href={cartUrl}>
                    {formatMessage(messages.emptyAction)}
                  </Button>
                </div>
              )}

              {orders.length > 0 && (
                <div className="purchases-page__list" ref={listRef}>
                  {pageOrders.map((order) => (
                    <OrderCard key={order.reference} order={order} />
                  ))}
                </div>
              )}

              {pageCount > 1 && (
                <Pagination
                  className="purchases-page__pager"
                  paginationLabel={formatMessage(messages.paginationLabel)}
                  pageCount={pageCount}
                  currentPage={currentPage}
                  onPageSelect={goToPage}
                  buttonLabels={{
                    previous: formatMessage(messages.previousPage),
                    next: formatMessage(messages.nextPage),
                    page: formatMessage(messages.page),
                    currentPage: formatMessage(messages.currentPage),
                    pageOfCount: formatMessage(messages.pageOfCount),
                  }}
                />
              )}
            </div>
          </main>
        </AppWrapper>
        <FooterSlot />
      </div>
    </>
  );
};

export default PurchaseHistoryPage;
