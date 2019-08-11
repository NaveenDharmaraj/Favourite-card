import React from 'react';
import { connect } from 'react-redux';
import {
    string,
} from 'prop-types';
import {
    Container,
    Breadcrumb,
} from 'semantic-ui-react';

const BreadcrumbDetails = (props) => {
    const {
        charityDetails,
    } = props;
    return (
        <Container>
            <Breadcrumb className="c-breadcrumb">
                <Breadcrumb.Section link>Explore</Breadcrumb.Section>
                <Breadcrumb.Divider icon="caret right" />
                <Breadcrumb.Section link>{((charityDetails.charityDetails.type) === 'beneficiaries' ? 'Charities' : (charityDetails.charityDetails.type))}</Breadcrumb.Section>
                <Breadcrumb.Divider icon="caret right" />
                <Breadcrumb.Section active>
                    {charityDetails.charityDetails.attributes.name}
                </Breadcrumb.Section>
            </Breadcrumb>
        </Container>
    );
};

BreadcrumbDetails.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                name: '',
            },
            type: '',
        },
    },
};

BreadcrumbDetails.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: {
                name: string,
            },
            type: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
    };
}

export default connect(mapStateToProps)(BreadcrumbDetails);
