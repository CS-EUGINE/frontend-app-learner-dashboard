import React from 'react';
import { render, screen } from '@testing-library/react';
import RecommendedCoursesList from './index';

const courses = [
  {
    courseId: 'course-v1:CloudSwyft+PY101+2026',
    courseUrl: 'http://localhost:18000/courses/course-v1:CloudSwyft+PY101+2026/about',
    imageUrl: 'http://localhost:18000/asset-v1:py101.jpg',
    title: 'Python Programming Fundamentals',
    orgName: 'CloudSwyft',
    description: '',
    startDate: '2026-08-04T06:00:45Z',
    price: 2500,
    currency: 'PHP',
    isPriced: true,
    selfPaced: false,
  },
  {
    courseId: 'course-v1:CloudSwyft+FREE101+2026',
    courseUrl: 'http://localhost:18000/courses/course-v1:CloudSwyft+FREE101+2026/about',
    imageUrl: 'http://localhost:18000/asset-v1:free101.jpg',
    title: 'Intro to Open Source',
    orgName: 'CloudSwyft',
    description: '',
    startDate: '2026-08-04T06:56:53Z',
    price: 0,
    currency: 'PHP',
    isPriced: false,
    selfPaced: true,
  },
];

describe('RecommendedCoursesList', () => {
  it('renders recommended courses heading', () => {
    render(<RecommendedCoursesList courses={courses} />);
    expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
  });

  it('renders a card per course from the catalog', () => {
    render(<RecommendedCoursesList courses={courses} />);
    expect(screen.getByText('Python Programming Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Intro to Open Source')).toBeInTheDocument();
  });

  it('prices paid courses and labels free ones', () => {
    render(<RecommendedCoursesList courses={courses} />);
    expect(screen.getByText('₱2,500')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders nothing when the catalog is empty', () => {
    const { container } = render(<RecommendedCoursesList courses={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
