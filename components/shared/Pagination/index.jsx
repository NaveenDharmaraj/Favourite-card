import React from 'react';
import { Pagination } from 'semantic-ui-react';
import PropTypes from 'prop-types';
const PaginationComponent = (props) => {
    const {
        activePage,
        totalPages,
        onPageChanged,
        firstItem,
        lastItem,
        prevItem,
        nextItem,
    } = props;
    return (
        <Pagination
            onPageChange={onPageChanged}
            activePage={activePage}
            totalPages={totalPages}
            firstItem={(activePage === 1) ? null : undefined}
            lastItem={(activePage === totalPages) ? null : undefined}
            prevItem={(activePage === 1) ? null : undefined}
            nextItem={(activePage === totalPages) ? null : undefined}
        />
    );
};


PaginationComponent.propTypes = {
    activePage: PropTypes.number,
    totalPages: PropTypes.number,
};
PaginationComponent.defaultProps = {
    activePage: 1,
    totalPages: 1,
};
export default PaginationComponent;
