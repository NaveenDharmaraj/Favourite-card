import React from 'react';
import { connect } from 'react-redux';
import {
    bool,
    string,
} from 'prop-types';

import {
    getBeneficiaryFromSlug,
} from '../actions/charity';
import Layout from '../components/shared/Layout';
import CharityProfileWrapper from '../components/charity';
import { Router } from '../routes';

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
        const {
            redirectToDashboard,
        } = this.props;
        return (
            <Layout>
                {!redirectToDashboard
                    ? <CharityProfileWrapper {...this.props} />
                    : Router.push('/dashboard')
                }
            </Layout>
        );
    }
}

CharityProfile.defaultProps = {
    redirectToDashboard: false,
    slug: '',
};

CharityProfile.propTypes = {
    redirectToDashboard: bool,
    slug: string,
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        redirectToDashboard: state.charity.redirectToDashboard,
    };
}

export default connect(mapStateToProps)(CharityProfile);
