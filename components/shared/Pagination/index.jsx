import React from 'react';
import { Pagination } from 'semantic-ui-react';
import PropTypes from 'prop-types';
const PaginationComponent = (props) => {
    const {
        activePage,
        totalPages,
        onPageChanged,
    } = props;
    return (
        <Pagination onPageChange={onPageChanged} activePage={activePage} totalPages={totalPages} />
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
