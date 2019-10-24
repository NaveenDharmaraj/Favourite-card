import React from 'react';
import { connect } from 'react-redux';
import {
    bool,
    string,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    getBeneficiaryFromSlug,
} from '../actions/charity';
import Layout from '../components/shared/Layout';
import CharityProfileWrapper from '../components/charity';
import { Router } from '../routes';

const actionTypes = {
    RESET_CHARITY_STATES: 'RESET_CHARITY_STATES',
};

class CharityProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        query,
    }) {
        reduxStore.dispatch({
            type: actionTypes.RESET_CHARITY_STATES,
        });
        await getBeneficiaryFromSlug(reduxStore.dispatch, query.slug);
        return {
            slug: query.slug,
        };
    }

    render() {
        const {
            charityDetails: {
                charityDetails: {
                    attributes: {
                        city,
                        description,
                        name,
                        province,
                    },
                },
            },
            redirectToDashboard,
        } = this.props;
        let title = `${name}`;
        if (!_isEmpty(city) && !_isEmpty(province)) {
            title = `${name} | ${city}, ${province}`;
        } else if (!_isEmpty(city) && _isEmpty(province)) {
            title = `${name} | ${city}`;
        } else if (_isEmpty(city) && !_isEmpty(province)) {
            title = `${name} | ${province}`;
        }
        const charityDescription = !_isEmpty(description) ? description : title;
        return (
            <Layout title={title} description={charityDescription}>
                {!redirectToDashboard
                    ? <CharityProfileWrapper {...this.props} />
                    : Router.push('/search')
                }
            </Layout>
        );
    }
}

CharityProfile.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                city: '',
                description: '',
                name: '',
                province: '',
            },
            type: '',
        },
    },
    redirectToDashboard: false,
    slug: '',
};

CharityProfile.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: {
                city: string,
                description: string,
                name: '',
                province: string,
            },
            type: string,
        },
    },
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
