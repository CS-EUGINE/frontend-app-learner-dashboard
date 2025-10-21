import React from 'react';
import { render, screen } from '@testing-library/react';
import RecommendedCoursesList from './index';

describe('RecommendedCoursesList', () => {
	it('renders recommended courses heading', () => {
		render(<RecommendedCoursesList />);
		const heading = screen.getByRole('heading', { level: 6 });
		expect(heading).toBeInTheDocument();
	});

	it('renders 4 course cards', () => {
		render(<RecommendedCoursesList />);
		const courseCards = screen.getAllByText('Data Science');
		expect(courseCards).toHaveLength(4);
	});
});
