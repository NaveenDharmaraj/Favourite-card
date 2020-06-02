/* ./__mocks__/next/dynamic.js */

import React from 'react';

const mockReact = React;

let componentName = 'DynamicComponent';

// eslint-disable-next-line import/exports-last
export const __setComponentName = (data) => {
    componentName = data;
};

const DynamicComponent = () => ({
    children, ...rest
}) => mockReact.createElement(componentName, rest, children);

export default DynamicComponent;
