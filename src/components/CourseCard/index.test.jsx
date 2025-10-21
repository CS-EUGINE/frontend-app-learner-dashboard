import React from 'react';
import { render } from '@testing-library/react';
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
        selfPaced={true}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});