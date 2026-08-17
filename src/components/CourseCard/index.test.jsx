import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import coursePlaceholder from 'assets/course-placeholder.svg';

import CourseCard from './index';

// Mock FontAwesomeIcon to avoid rendering issues in StarRating
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props) => <span {...props} />,
}));

describe('CourseCard', () => {
  it('matches snapshot with required props', () => {
    const { asFragment } = render(
      <CourseCard
        imageUrl="https://example.com/image.png"
        title="Test Course"
        description="A sample course description."
        price="$28"
        rating={4.2}
        selfPaced
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  // Catalog courses carry no rating, and most carry no short description.
  it('omits the description but still shows a rating when the course has neither', () => {
    render(
      <CourseCard
        imageUrl="https://example.com/image.png"
        title="Data Science Essentials"
        price="₱3,200"
        selfPaced={false}
      />,
    );
    expect(screen.getByText('Data Science Essentials')).toBeInTheDocument();
    expect(screen.getByText('₱3,200')).toBeInTheDocument();
    expect(screen.getByText('Instructor-Paced')).toBeInTheDocument();
    expect(screen.getByText('0 Reviews')).toBeInTheDocument();
  });

  it('shows a supplied rating', () => {
    render(<CourseCard title="Demo" price="Free" rating={4.6} />);
    expect(screen.getByText('4.6 Reviews')).toBeInTheDocument();
  });

  it('shows the org, start date and self-paced label', () => {
    render(
      <CourseCard
        title="Demo"
        orgName="CloudSwyft"
        price="₱2,500"
        selfPaced
        startDate="2026-08-04T06:00:45Z"
      />,
    );
    expect(screen.getByText('CloudSwyft')).toBeInTheDocument();
    expect(screen.getByText(/^Starts: /)).toBeInTheDocument();
    expect(screen.getByText('Self-Paced')).toBeInTheDocument();
  });

  it('omits the start date when the course has none', () => {
    render(<CourseCard title="Demo" price="Free" />);
    expect(screen.queryByText(/^Starts: /)).not.toBeInTheDocument();
  });

  // Matching /courses, where a free course gets the neutral badge and a paid
  // one gets the green.
  it('gives paid and free courses different badges', () => {
    const { rerender } = render(<CourseCard title="Demo" price="₱2,500" isPriced />);
    expect(screen.getByText('₱2,500').className).toContain('tw:bg-[#12805C]');

    rerender(<CourseCard title="Demo" price="Free" isPriced={false} />);
    expect(screen.getByText('Free').className).toContain('tw:bg-[#4B5563]');
  });

  it('links the whole card to the course', () => {
    render(<CourseCard title="Demo" price="Free" courseUrl="http://lms/courses/x/about" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://lms/courses/x/about');
  });

  describe('course image', () => {
    it('uses the placeholder when the course has no image', () => {
      render(<CourseCard title="Data Science Essentials" price="₱3,200" />);
      expect(screen.getByAltText('Data Science Essentials')).toHaveAttribute('src', coursePlaceholder);
    });

    it('uses the course image when there is one', () => {
      render(<CourseCard imageUrl="https://example.com/image.png" title="Demo" price="Free" />);
      expect(screen.getByAltText('Demo')).toHaveAttribute('src', 'https://example.com/image.png');
    });

    it('falls back to the placeholder when the image fails to load', () => {
      render(<CourseCard imageUrl="https://example.com/gone.png" title="Demo" price="Free" />);
      const image = screen.getByAltText('Demo');
      fireEvent.error(image);
      expect(image).toHaveAttribute('src', coursePlaceholder);
    });

    it('does not loop when the placeholder itself errors', () => {
      render(<CourseCard title="Demo" price="Free" />);
      const image = screen.getByAltText('Demo');
      fireEvent.error(image);
      expect(image).toHaveAttribute('src', coursePlaceholder);
    });
  });
});
