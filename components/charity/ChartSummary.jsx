import React, { Fragment } from 'react';

const ChartSummary = (props) => {
    const {
        color,
        text,
        value,
    } = props;
    return (
        <Fragment>
            <p>{color}</p>
            <p>{text}</p>
            <p>{value}</p>
        </Fragment>
    );
};

export default ChartSummary;
