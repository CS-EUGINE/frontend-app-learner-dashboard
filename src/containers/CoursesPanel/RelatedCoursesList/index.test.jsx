import React from 'react';
import { render, screen } from '@testing-library/react';
import RelatedCoursesList from './index';

describe('RelatedCoursesList', () => {
	it('renders related courses heading', () => {
		render(<RelatedCoursesList />);
		const heading = screen.getByRole('heading', { level: 6 });
		expect(heading).toBeInTheDocument();
	});

	it('renders 4 course cards', () => {
		render(<RelatedCoursesList />);
		const courseCards = screen.getAllByText('Data Science');
		expect(courseCards).toHaveLength(4);
	});
});
