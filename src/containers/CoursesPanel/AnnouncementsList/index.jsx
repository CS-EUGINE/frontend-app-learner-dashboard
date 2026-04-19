import { useIntl } from '@edx/frontend-platform/i18n';
import { useState } from 'react';
import messages from './messages';

const ITEMS_PER_PAGE = 2;

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna. Integer sem enim, placerat nec lorem nec, molestie lobortis enim. In hac habitasse platea dictumst. Cras dignissim sit amet dui quis ultrices. Phasellus ut congue nisl. Cras ut scelerisque quam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed placerat sem sit amet sodales fermentum. Quisque erat urna, lacinia non libero nec, posuere sodales neque. Aliquam eget faucibus dui, quis porttitor nunc. Pellentesque a odio consectetur, dignissim diam at, rutrum tortor. Nam luctus elit id erat vehicula consectetur a non erat. Proin porta pulvinar nulla, ac bibendum felis efficitur vitae. Proin at nisi odio. Mauris scelerisque, leo eget mollis blandit, tortor est porttitor purus, at rutrum mi sem in eros.',
  },
  {
    id: 2,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna. Integer sem enim, placerat nec lorem nec, molestie lobortis enim. In hac habitasse platea dictumst. Cras dignissim sit amet dui quis ultrices. Phasellus ut congue nisl. Cras ut scelerisque quam. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed placerat sem sit amet sodales fermentum. Quisque erat urna, lacinia non libero nec, posuere sodales neque. Aliquam eget faucibus dui, quis porttitor nunc. Pellentesque a odio consectetur, dignissim diam at, rutrum tortor. Nam luctus elit id erat vehicula consectetur a non erat. Proin porta pulvinar nulla, ac bibendum felis efficitur vitae. Proin at nisi odio. Mauris scelerisque, leo eget mollis blandit, tortor est porttitor purus, at rutrum mi sem in eros.',
  },
  {
    id: 3,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
  {
    id: 4,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
  {
    id: 5,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
  {
    id: 6,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
  {
    id: 7,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
  {
    id: 8,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
  {
    id: 9,
    title: 'Announcement Title',
    date: 'Wednesday, 5 October 2022, 10:50 AM',
    body: 'Nam eu posuere arcu. Nullam neque elit, egestas et dignissim tempus, tincidunt sit amet urna.',
  },
];

const MAX_BODY_LENGTH = 400;

const AnnouncementsList = () => {
  const { formatMessage } = useIntl();
  const [currentPage, setCurrentPage] = useState(1);

  const announcements = MOCK_ANNOUNCEMENTS;
  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = announcements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  return (
    <div className="tw:py-8">
      <h6 className="tw:text-secondary tw:text-[28px] tw:font-semibold tw:py-4">
        {formatMessage(messages.announcements)}
      </h6>

      {/* Filters */}
      <div className="tw:flex tw:gap-6 tw:mb-6">
        <select className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-600 tw:bg-white tw:min-w-[160px]">
          <option>{formatMessage(messages.fromAll)}</option>
        </select>
        <select className="tw:border tw:border-gray-300 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-600 tw:bg-white tw:min-w-[160px]">
          <option>{formatMessage(messages.allTime)}</option>
        </select>
      </div>

      {/* Announcement Cards */}
      <div className="tw:flex tw:flex-col tw:gap-6">
        {pageItems.map((announcement) => {
          const isTruncated = announcement.body.length > MAX_BODY_LENGTH;
          const displayBody = isTruncated
            ? `${announcement.body.slice(0, MAX_BODY_LENGTH)}...`
            : announcement.body;

          return (
            <div
              key={announcement.id}
              className="tw:border tw:border-gray-200 tw:rounded-lg tw:p-6"
            >
              <h3 className="tw:text-lg tw:font-bold tw:text-secondary tw:mb-1">
                {announcement.title}
              </h3>
              <p className="tw:text-gray-400 tw:text-sm tw:mb-4">
                {announcement.date}
              </p>
              <p className="tw:text-gray-600 tw:text-sm tw:leading-relaxed">
                {displayBody}
              </p>
              {isTruncated && (
                <div className="tw:flex tw:justify-end tw:mt-2">
                  <button
                    type="button"
                    className="tw:text-secondary tw:font-bold tw:text-sm tw:underline tw:bg-transparent tw:cursor-pointer"
                  >
                    {formatMessage(messages.readMore)}
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
          {renderPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="tw:px-2 tw:text-gray-400">…</span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`tw:w-8 tw:h-8 tw:rounded tw:text-sm tw:font-semibold tw:cursor-pointer ${
                  currentPage === page
                    ? 'tw:bg-secondary tw:text-white'
                    : 'tw:bg-transparent tw:text-gray-400 hover:tw:text-secondary'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;
