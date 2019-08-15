import React from 'react';
import { connect } from 'react-redux';
import {
    func,
    PropTypes,
    string,
} from 'prop-types';

import {
    getBeneficiaryFromSlug,
} from '../actions/charity';
import Layout from '../components/shared/Layout';
import CharityProfileWrapper from '../components/charity';

class CharityProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        query,
    }) {
        await getBeneficiaryFromSlug(reduxStore.dispatch, query.slug);
        return {
            slug: query.slug,
        };
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
