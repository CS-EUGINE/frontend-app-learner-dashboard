import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import FooterSlot from '@openedx/frontend-slot-footer';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';
import urls from 'data/services/lms/urls';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import { SubsiteBrandingContext } from './SubsiteBrandingContext';
import './App.scss';
import './sass/_tailwind.scss';

export const App = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const [branding, setBranding] = React.useState(null);
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  React.useEffect(() => {
    let mounted = true;
    fetch(urls.subsiteBrandingUrl(), { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (mounted && payload?.subsite) {
          setBranding(payload.subsite);
        }
      })
      .catch(() => {
        // Runtime branding is an enhancement; keep the compiled default if
        // the LMS branding endpoint is temporarily unavailable.
      });
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    if (!branding) {
      return undefined;
    }
    const root = document.documentElement;
    root.style.setProperty('--subsite-primary', branding.primary_color);
    root.style.setProperty('--subsite-secondary', branding.secondary_color);
    root.style.setProperty('--subsite-accent', branding.accent_color);
    return undefined;
  }, [branding]);

  React.useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
    if (getConfig().HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: getConfig().HOTJAR_APP_ID,
          hotjarVersion: getConfig().HOTJAR_VERSION,
          hotjarDebug: !!getConfig().HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, [authenticatedUser, loadData]);
  const hasBrandingContent = Boolean(
    branding && (branding.banner_url || branding.description || branding.contact_email || branding.labs_site),
  );
  return (
    <SubsiteBrandingContext.Provider value={branding}>
      <>
        <Helmet>
          <title>{formatMessage(messages.pageTitle)}</title>
          <link
            rel="shortcut icon"
            href={branding?.favicon_url || getConfig().FAVICON_URL}
            type="image/x-icon"
          />
        </Helmet>
        <div>
          <AppWrapper>
            <LearnerDashboardHeader />
            <main>
              {hasBrandingContent && (
              <section
                className="subsite-dashboard-banner"
                aria-label={branding.name || 'Organization information'}
                style={branding.banner_url ? { backgroundImage: `url(${branding.banner_url})` } : undefined}
              >
                <div className="subsite-dashboard-banner-content">
                  {branding.name && <h1 className="subsite-dashboard-banner-title">{branding.name}</h1>}
                  {branding.description && (
                    <p className="subsite-dashboard-banner-description">{branding.description}</p>
                  )}
                  {(branding.contact_email || branding.labs_site) && (
                    <div className="subsite-dashboard-links">
                      {branding.contact_email && (
                        <a href={`mailto:${branding.contact_email}`} className="subsite-dashboard-link">
                          Contact support
                        </a>
                      )}
                      {branding.labs_site && (
                        <a
                          href={branding.labs_site}
                          className="subsite-dashboard-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Virtual labs
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </section>
              )}
              {hasNetworkFailure
                ? (
                  <Alert variant="danger">
                    <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
                  </Alert>
                ) : (
                  <Dashboard />
                )}
            </main>
          </AppWrapper>
          <FooterSlot />
        </div>
      </>
    </SubsiteBrandingContext.Provider>
  );
};

export default App;
