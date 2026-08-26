import { useIntl } from '@edx/frontend-platform/i18n';
import { useMemo, useState } from 'react';

import { useAnnouncements } from '../hooks';
import messages from './messages';

import './index.scss';

const ITEMS_PER_PAGE = 2;
const MAX_BODY_LENGTH = 400;

const ALL = 'all';

// The model's three levels. The colour that separates them lives in
// index.scss, keyed off `announcement-card--<level>`; what is needed here is
// the name for the screen-reader label, since a coloured border says nothing
// to a reader who cannot see it.
const LEVEL_LABELS = {
  info: messages.levelInfo,
  success: messages.levelSuccess,
  warning: messages.levelWarning,
};

export const DATE_RANGES = {
  [ALL]: null,
  last7: 7,
  last30: 30,
};

/**
 * Announcements published by staff (`lms.djangoapps.site_announcements`), shown
 * under the course lists. The endpoint already drops anything inactive,
 * scheduled or expired, so everything that arrives is displayable and the two
 * selects below only narrow it further.
 */
const AnnouncementsList = () => {
  const { formatMessage, formatDate } = useIntl();
  const { announcements, isLoading } = useAnnouncements();
  const [currentPage, setCurrentPage] = useState(1);
  const [level, setLevel] = useState(ALL);
  const [dateRange, setDateRange] = useState(ALL);
  const [expandedIds, setExpandedIds] = useState([]);

  const visibleAnnouncements = useMemo(() => {
    const days = DATE_RANGES[dateRange];
    const cutoff = days === null ? null : Date.now() - (days * 24 * 60 * 60 * 1000);
    return announcements.filter((announcement) => (
      (level === ALL || announcement.level === level)
      && (cutoff === null || announcement.date.getTime() >= cutoff)
    ));
  }, [announcements, level, dateRange]);

  const totalPages = Math.ceil(visibleAnnouncements.length / ITEMS_PER_PAGE);
  // A filter change can leave the list shorter than the page we were on, so
  // read past the end as the last page rather than rendering an empty one.
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = visibleAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const toggleExpanded = (id) => () => setExpandedIds((ids) => (
    ids.includes(id) ? ids.filter((expandedId) => expandedId !== id) : [...ids, id]
  ));

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;

    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
      pages.push(i);
    }

    if (totalPages > maxVisible + 1) {
      pages.push('...');
    }

    if (totalPages > maxVisible) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Nothing to announce is the normal case, so the whole section stays out of
  // the page rather than showing an empty shell with dead filters.
  if (isLoading || announcements.length === 0) {
    return null;
  }

  return (
    <div className="tw:py-8">
      <h6 className="tw:text-secondary tw:text-[28px] tw:font-semibold tw:py-4">
        {formatMessage(messages.announcements)}
      </h6>

      {/* Filters */}
      <div className="tw:flex tw:gap-6 tw:mb-6">
        <select
          aria-label={formatMessage(messages.filterLevelLabel)}
          value={level}
          onChange={handleFilterChange(setLevel)}
          className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-600 tw:bg-white tw:min-w-[160px]"
        >
          <option value={ALL}>{formatMessage(messages.fromAll)}</option>
          <option value="info">{formatMessage(messages.levelInfo)}</option>
          <option value="success">{formatMessage(messages.levelSuccess)}</option>
          <option value="warning">{formatMessage(messages.levelWarning)}</option>
        </select>
        <select
          aria-label={formatMessage(messages.filterDateLabel)}
          value={dateRange}
          onChange={handleFilterChange(setDateRange)}
          className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-600 tw:bg-white tw:min-w-[160px]"
        >
          <option value={ALL}>{formatMessage(messages.allTime)}</option>
          <option value="last7">{formatMessage(messages.lastWeek)}</option>
          <option value="last30">{formatMessage(messages.lastMonth)}</option>
        </select>
      </div>

      {/* Announcement Cards */}
      <div className="tw:flex tw:flex-col tw:gap-6">
        {pageItems.length === 0 && (
          <p className="tw:text-gray-600 tw:text-sm">{formatMessage(messages.noMatches)}</p>
        )}
        {pageItems.map((announcement) => {
          const isExpanded = expandedIds.includes(announcement.id);
          const isTruncated = announcement.body.length > MAX_BODY_LENGTH;
          const displayBody = isTruncated && !isExpanded
            ? `${announcement.body.slice(0, MAX_BODY_LENGTH)}...`
            : announcement.body;

          const levelName = LEVEL_LABELS[announcement.level] ? announcement.level : 'info';

          return (
            <div
              key={announcement.id}
              className={`announcement-card announcement-card--${levelName} tw:rounded-lg tw:p-6`}
            >
              <h3 className="tw:text-lg tw:font-bold tw:text-secondary tw:mb-1">
                <span className="sr-only">{`${formatMessage(LEVEL_LABELS[levelName])}: `}</span>
                {announcement.title}
              </h3>
              <p className="tw:text-gray-400 tw:text-sm tw:mb-4">
                {formatDate(announcement.date, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="tw:text-gray-600 tw:text-sm tw:leading-relaxed tw:whitespace-pre-line">
                {displayBody}
              </p>
              {isTruncated && (
                <div className="tw:flex tw:justify-end tw:mt-2">
                  <button
                    type="button"
                    onClick={toggleExpanded(announcement.id)}
                    className="tw:text-secondary tw:font-bold tw:text-sm tw:underline tw:bg-transparent tw:cursor-pointer"
                  >
                    {formatMessage(isExpanded ? messages.readLess : messages.readMore)}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="tw:flex tw:justify-center tw:items-center tw:gap-2 tw:mt-8">
          {renderPageNumbers().map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span key={`ellipsis-${index}`} className="tw:px-2 tw:text-gray-400">…</span>
            ) : (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`tw:w-8 tw:h-8 tw:rounded tw:text-sm tw:font-semibold tw:cursor-pointer ${
                  page === pageNumber
                    ? 'tw:bg-secondary tw:text-white'
                    : 'tw:bg-transparent tw:text-gray-400 tw:hover:text-secondary'
                }`}
              >
                {pageNumber}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
