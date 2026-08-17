import React from 'react';
import { render, screen } from '@testing-library/react';
import RelatedCoursesList from './index';

const courses = [
  {
    courseId: 'course-v1:CloudSwyft+DS201+2026',
    courseUrl: 'http://localhost:18000/courses/course-v1:CloudSwyft+DS201+2026/about',
    imageUrl: 'http://localhost:18000/asset-v1:ds201.jpg',
    title: 'Data Science Essentials',
    orgName: 'CloudSwyft',
    description: '',
    startDate: '2026-08-04T06:00:50Z',
    price: 3200,
    currency: 'PHP',
    isPriced: true,
    selfPaced: false,
  },
  {
    courseId: 'course-v1:CloudSwyft+WEB101+2026',
    courseUrl: 'http://localhost:18000/courses/course-v1:CloudSwyft+WEB101+2026/about',
    imageUrl: 'http://localhost:18000/asset-v1:web101.jpg',
    title: 'Web Development Bootcamp',
    orgName: 'CloudSwyft',
    description: '',
    startDate: '2026-08-04T06:00:57Z',
    price: 1800,
    currency: 'PHP',
    isPriced: true,
    selfPaced: false,
  },
];

describe('RelatedCoursesList', () => {
  it('renders related courses heading', () => {
    render(<RelatedCoursesList courses={courses} />);
    expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
  });

  it('renders a card per course from the catalog', () => {
    render(<RelatedCoursesList courses={courses} />);
    expect(screen.getByText('Data Science Essentials')).toBeInTheDocument();
    expect(screen.getByText('Web Development Bootcamp')).toBeInTheDocument();
    expect(screen.getByText('₱3,200')).toBeInTheDocument();
  });

  it('renders nothing when there are no related courses', () => {
    const { container } = render(<RelatedCoursesList courses={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
