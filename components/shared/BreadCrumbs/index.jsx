import React from 'react';
import PropTypes from 'prop-types';
import {
    Container,
    Breadcrumb,
} from 'semantic-ui-react';
import _ from 'lodash';


const BreadcrumbDetails = (props) => {
    const {
        pathDetails,
    } = props;
    const renderBreadCrumbs = () => {
        const breadcrumbBlock = [];

        if (pathDetails && typeof pathDetails === 'object') {
            pathDetails.forEach((path, i) => {
                breadcrumbBlock.push(
                    <Breadcrumb.Section>{path}</Breadcrumb.Section>,
                );
                if (i !== pathDetails.length - 1) {
                    breadcrumbBlock.push(
                        <Breadcrumb.Divider icon="caret right" />,
                    );
                }
            });
        }
        return breadcrumbBlock;
    };
    return (
        <Container>
            <Breadcrumb className="c-breadcrumb">
                {renderBreadCrumbs()}
            </Breadcrumb>
        </Container>
    );
};

BreadcrumbDetails.defaultProps = {
    pathDetails: [],
};

BreadcrumbDetails.propTypes = {
    pathDetails: PropTypes.arrayOf(PropTypes.string),
};

export default BreadcrumbDetails;
