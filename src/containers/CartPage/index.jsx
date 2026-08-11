import React from 'react';
import { Helmet } from 'react-helmet';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert, Button, Icon, Spinner } from '@openedx/paragon';
import { ShoppingCart } from '@openedx/paragon/icons';
import FooterSlot from '@openedx/frontend-slot-footer';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';

import CartItemRow from './CartItemRow';
import CartSummary from './CartSummary';
import { useCartData } from './hooks';
import messages from './messages';
import './index.scss';

export const CartPage = () => {
  const { formatMessage } = useIntl();
  const {
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
  } = useCartData();

  const isBusy = isCheckingOut || pendingCourseId !== null;
  const isEmpty = !isLoading && !loadError && cart.itemCount === 0;
  const nothingSelected = !isLoading && cart.itemCount > 0 && selectedItems.length === 0;

  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div>
        <AppWrapper>
          <LearnerDashboardHeader />
          <main className="cart-page">
            <div className="cart-page__inner">
              <h1 className="cart-page__title">{formatMessage(messages.heading)}</h1>

              {fulfilledCourses.length > 0 && (
                <Alert variant="success">
                  <Alert.Heading>{formatMessage(messages.paymentConfirmedTitle)}</Alert.Heading>
                  <p className="mb-2">
                    {formatMessage(messages.paymentConfirmedBody, {
                      courses: fulfilledCourses.join(', '),
                    })}
                  </p>
                  <Button variant="success" size="sm" href={getConfig().PUBLIC_PATH}>
                    {formatMessage(messages.goToDashboard)}
                  </Button>
                </Alert>
              )}

              {loadError && (
                <Alert variant="danger">{formatMessage(messages.loadError)}</Alert>
              )}
              {checkoutError && (
                <Alert variant="danger">{formatMessage(messages.checkoutError)}</Alert>
              )}

              {isLoading && (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" screenReaderText={formatMessage(messages.loading)} />
                </div>
              )}

              {isEmpty && (
                <div className="cart-page__empty">
                  <Icon src={ShoppingCart} size="lg" className="cart-page__empty-icon mx-auto" />
                  <h2 className="cart-page__empty-title">{formatMessage(messages.emptyTitle)}</h2>
                  <p className="cart-page__empty-body">{formatMessage(messages.emptyBody)}</p>
                  <Button variant="outline-primary" href={getConfig().PUBLIC_PATH}>
                    {formatMessage(messages.backToDashboard)}
                  </Button>
                </div>
              )}

              {!isLoading && cart.itemCount > 0 && (
                <div className="cart-page__layout">
                  <div className="cart-page__items">
                    {cart.items.map((item) => (
                      <CartItemRow
                        key={item.courseId}
                        item={item}
                        isSelected={selected.includes(item.courseId)}
                        isPending={pendingCourseId === item.courseId || pendingCourseId === 'all'}
                        onToggle={toggleSelected}
                        onRemove={removeItem}
                      />
                    ))}

                    {nothingSelected && (
                      <Alert variant="warning" className="mt-3 mb-0">
                        {formatMessage(messages.nothingSelected)}
                      </Alert>
                    )}

                    <div className="cart-page__clear">
                      <Button variant="link" size="sm" onClick={clear} disabled={isBusy}>
                        {formatMessage(messages.clearCart)}
                      </Button>
                    </div>
                  </div>

                  <CartSummary
                    count={selectedItems.length}
                    subtotalCentavos={subtotalCentavos}
                    isCheckingOut={isCheckingOut}
                    isDisabled={isBusy || selectedItems.length === 0}
                    onCheckout={checkout}
                  />
                </div>
              )}
            </div>
          </main>
        </AppWrapper>
        <FooterSlot />
      </div>
    </>
  );
};

export default CartPage;
