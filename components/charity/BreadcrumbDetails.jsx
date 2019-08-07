import React from 'react';
import { connect } from 'react-redux';
import {
    Container,
    Breadcrumb,
} from 'semantic-ui-react';

class BreadcrumbDetails extends React.Component {
    render() {
        const {
            charityDetails
        } = this.props;
        return (
            <Container>
                        <Breadcrumb className="c-breadcrumb">
                            <Breadcrumb.Section link>Explore</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right"/>
                            <Breadcrumb.Section link>{(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.type)}</Breadcrumb.Section>
                            <Breadcrumb.Divider icon="caret right"/>
                            <Breadcrumb.Section active>{(charityDetails && charityDetails.charityDetails
                                && charityDetails.charityDetails.attributes && charityDetails.charityDetails.attributes.name)}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
    };
}

export default connect(mapStateToProps)(BreadcrumbDetails);
