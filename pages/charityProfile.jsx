import React from 'react';
import { connect } from 'react-redux';
import {
    array,
    bool,
    string,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _join from 'lodash/join';
import _slice from 'lodash/slice';
import _map from 'lodash/map';
import _property from 'lodash/property';
import getConfig from 'next/config';

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
        const { publicRuntimeConfig } = getConfig();

        const {
            APP_URL_ORIGIN,
        } = publicRuntimeConfig;
        const {
            charityDetails: {
                charityDetails: {
                    attributes: {
                        avatar,
                        causes,
                        city,
                        description,
                        name,
                        province,
                        slug,
                    },
                },
            },
            redirectToDashboard,
        } = this.props;
        const title = `${name} | Canadian charity | Charitable Impact`;
        /* Commenting line number from 63 to 70 with reference to PM-462
        if (!_isEmpty(city) && !_isEmpty(province)) {
            title = `${name} | ${city}, ${province}`;
        } else if (!_isEmpty(city) && _isEmpty(province)) {
            title = `${name} | ${city}`;
        } else if (_isEmpty(city) && !_isEmpty(province)) {
            title = `${name} | ${province}`;
        } */
        const charityDescription = !_isEmpty(description) ? description : title;
        const causesList = (causes.length > 0) ? _map(causes, _property('name')) : [];
        const keywords = (causesList.length > 0) ? _join(_slice(causesList, 0, 10), ', ') : '';
        const url = `${APP_URL_ORIGIN}/charities/${slug}`;
        return (
            <Layout
                avatar={avatar}
                keywords={keywords}
                title={title}
                description={charityDescription}
                url={url}
            >
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
                avatar: '',
                causes: [],
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
                avatar: string,
                causes: array,
                city: string,
                description: string,
                name: string,
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
