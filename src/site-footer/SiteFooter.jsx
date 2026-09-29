/**
 * The site footer, the same on every MFE and matching the LMS footer.
 *
 * ONE COMPONENT, FOUR COPIES, like src/site-header: this folder is identical
 * in frontend-app-learner-dashboard, -account, -profile and -learning. Check
 * with `md5sum mfes/frontend-app-*\/src/site-footer/*`. The LMS side is the
 * Indigo theme's lms/templates/footer.html; its links, copy, social profiles
 * and look must stay in step with this.
 *
 * Rendered in place of <FooterSlot />, not inside it: on staging tutor-indigo
 * fills that slot with its own IndigoFooter, which would win over anything
 * put in the slot's default content.
 *
 * All the copy is sourced, as in footer.html: the blurb is cloudswyft.com's
 * meta description, the socials are the four profiles cloudswyft.com links to
 * (there is no X/Twitter account), and the copyright holder is as on
 * cloudswyft.com's own footer.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { defineMessages, useIntl } from '@edx/frontend-platform/i18n';

import './SiteFooter.scss';

const messages = defineMessages({
  home: { id: 'site-footer.home', defaultMessage: 'CloudSwyft home' },
  tagline: { id: 'site-footer.tagline', defaultMessage: 'Learning Platform' },
  footerNav: { id: 'site-footer.nav', defaultMessage: 'Footer' },
  social: { id: 'site-footer.social', defaultMessage: 'CloudSwyft on social media' },
  newTab: { id: 'site-footer.new-tab', defaultMessage: '{network} (opens in a new tab)' },
  poweredBy: { id: 'site-footer.powered-by', defaultMessage: 'Powered by' },
  copyright: { id: 'site-footer.copyright', defaultMessage: 'Copyright' },
  rights: { id: 'site-footer.rights', defaultMessage: 'All rights reserved' },
});

// Paths on the LMS; same list and order as FOOTER_LINKS in footer.html.
const FOOTER_LINKS = [
  ['/products', 'Products'],
  ['/news', 'Articles & Blog'],
  ['/privacy', 'Privacy Policy'],
  ['/faq', 'FAQs'],
  ['/tos', 'Terms and Conditions'],
  ['/contact', 'Contact Us'],
];

const FOOTER_BLURB = 'CloudSwyft has one of the fastest-growing technology learning platforms '
  + 'with future-ready technology skills for education, governments, and organizations.';

const SOCIAL_LINKS = [
  ['facebook', 'Facebook', 'https://www.facebook.com/cloudswyft/'],
  ['instagram', 'Instagram', 'https://www.instagram.com/cloudswyft/'],
  ['linkedin', 'LinkedIn', 'https://www.linkedin.com/company/cloudswyft'],
  ['youtube', 'YouTube', 'https://www.youtube.com/c/CloudSwyft_Official'],
];

const COPYRIGHT_HOLDER = 'CloudSwyft Global Systems, Ltd.';

// Fallback only; the LMS sends the real address in the MFE runtime config.
const DEFAULT_EMAIL = 'info@cloudswyft.com';

const SocialIcon = ({ kind }) => {
  switch (kind) {
    case 'facebook':
      return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.5 21v-7.2h2.4l.4-2.9h-2.8V9.1c0-.8.2-1.4 1.4-1.4h1.5V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.2H8.3v2.9h2.4V21z" /></svg>;
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="16.6" cy="7.4" r="1.1" fill="currentColor" />
        </svg>
      );
    case 'linkedin':
      return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 8.9H4V19h2.6zM5.3 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM20 13.2c0-2.7-1.5-4.5-3.9-4.5-1.3 0-2.2.7-2.6 1.4V8.9H11V19h2.6v-5.3c0-1.3.6-2.3 1.8-2.3s1.7.9 1.7 2.3V19H20z" /></svg>;
    case 'youtube':
      return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.6 8.2c-.2-.8-.8-1.4-1.6-1.6C17.6 6.2 12 6.2 12 6.2s-5.6 0-7 .4c-.8.2-1.4.8-1.6 1.6C3 9.6 3 12 3 12s0 2.4.4 3.8c.2.8.8 1.4 1.6 1.6 1.4.4 7 .4 7 .4s5.6 0 7-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-3.8.4-3.8s0-2.4-.4-3.8zM10.2 14.6V9.4l4.6 2.6z" /></svg>;
    default:
      return null;
  }
};
SocialIcon.propTypes = { kind: PropTypes.string.isRequired };

const SiteFooter = () => {
  const { formatMessage } = useIntl();
  const config = getConfig();
  const lms = (path) => `${config.LMS_BASE_URL}${path}`;
  // The trimmed CloudSwyft logo from the Indigo theme, served by the LMS.
  const logo = lms('/static/indigo/images/cloudswyft-logo.png');
  const email = config.INFO_EMAIL || config.CONTACT_EMAIL || DEFAULT_EMAIL;

  return (
    <div className="cs-footer-wrapper">
      <footer className="cs-footer">
        <div className="cs-footer-grid">
          <div className="cs-footer-brand">
            <a className="cs-footer-logo" href={lms('/')} aria-label={formatMessage(messages.home)}>
              <img src={logo} alt="CloudSwyft" />
              <span className="cs-footer-tagline">{formatMessage(messages.tagline)}</span>
            </a>
            <p className="cs-footer-blurb">{FOOTER_BLURB}</p>
          </div>

          <nav className="cs-footer-links" aria-label={formatMessage(messages.footerNav)}>
            <ul>
              {FOOTER_LINKS.map(([path, label]) => (
                <li key={path}><a href={lms(path)}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="cs-footer-contact">
            <a className="cs-footer-email" href={`mailto:${email}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zm2.2.5 6.8 5.2L18.8 7zM19 8.6l-7 5.4-7-5.4V17h14z" /></svg>
              <span>{email}</span>
            </a>
            <ul className="cs-footer-social" aria-label={formatMessage(messages.social)}>
              {SOCIAL_LINKS.map(([kind, name, url]) => (
                <li key={kind}>
                  <a
                    className={`cs-social cs-social-${kind}`}
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={formatMessage(messages.newTab, { network: name })}
                  >
                    <SocialIcon kind={kind} />
                  </a>
                </li>
              ))}
            </ul>
            <div className="cs-footer-powered">
              <span>{formatMessage(messages.poweredBy)}</span>
              <a href="https://www.cloudswyft.com" rel="noopener noreferrer" target="_blank">
                <img src={logo} alt="CloudSwyft" />
              </a>
            </div>
          </div>
        </div>

        <div className="cs-footer-bottom">
          <p className="cs-footer-copyright">
            <span className="cs-footer-part">
              {formatMessage(messages.copyright)} &copy; {new Date().getFullYear()} {COPYRIGHT_HOLDER}
            </span>
            <span aria-hidden="true" className="cs-footer-sep">|</span>
            <span className="cs-footer-part">{formatMessage(messages.rights)}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SiteFooter;
