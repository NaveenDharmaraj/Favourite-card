import React from 'react';
import { connect } from 'react-redux';
import {
    func,
    PropTypes,
    string,
} from 'prop-types';

import {
    getBeneficiaryFromSlug,
} from '../actions/give';
import Layout from '../components/shared/Layout';
import CharityProfileWrapper from '../components/charity';

class CharityProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        query,
    }) {
        // TODO get api data from getInitialProps instead of componentDidMount
        // getBeneficiaryFromSlug(reduxStore.dispatch, query.slug);
        // console.log("Initialprops called --------> reduxStore --->",reduxStore);
        return {
            slug: query.slug,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            slug,
        } = this.props;
        getBeneficiaryFromSlug(dispatch, slug);
    }

    render() {
        return (
            <Layout>
                <CharityProfileWrapper {...this.props} />
            </Layout>
        );
    }
}

CharityProfile.defaultProps = {
    slug: '',
};

CharityProfile.propTypes = {
    slug: string,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
    };
}

export default connect(mapStateToProps)(CharityProfile);
