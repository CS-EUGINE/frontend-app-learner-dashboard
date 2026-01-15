import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { render, fireEvent } from '@testing-library/react';
import StarRating from './index';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props) => <span {...props} />,
}));

describe('StarRating', () => {
  it('matches snapshot with default props', () => {
    const wrapper = shallow(<StarRating />);
    expect(wrapper.snapshot).toMatchSnapshot();
  });

  it('matches snapshot with value 3.5', () => {
    const wrapper = shallow(<StarRating value={3.5} />);
    expect(wrapper.snapshot).toMatchSnapshot();
  });

  it('matches snapshot when disabled', () => {
    const wrapper = shallow(<StarRating value={4.6} disabled />);
    expect(wrapper.snapshot).toMatchSnapshot();
  });
  
  it('calls onHover and onRate when interacted with', () => {
    const onRate = jest.fn();
    const onHover = jest.fn();
    const { getAllByRole } = render(
      <StarRating
        max={5}
        value={4.2}
        onRate={onRate}
        onHover={onHover}
        hovered={4.5}
      />
    );

    const buttons = getAllByRole('button');
    fireEvent.mouseMove(buttons[0], {
      target: { getBoundingClientRect: () => ({ left: 0, width: 20 }) },
      clientX: 10,
    });
    expect(onHover).toHaveBeenCalled();

    fireEvent.click(buttons[0], {
      target: { getBoundingClientRect: () => ({ left: 0, width: 20 }) },
      clientX: 10,
    });
    expect(onRate).toHaveBeenCalled();
  });
  
});
