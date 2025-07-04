import React from 'react';
import PropTypes from 'prop-types';

export const DashboardLayout = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
