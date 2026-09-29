import React from 'react';

export const SubsiteBrandingContext = React.createContext(null);

export const useSubsiteBranding = () => React.useContext(SubsiteBrandingContext);

export default SubsiteBrandingContext;
