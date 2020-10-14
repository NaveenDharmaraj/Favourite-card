import React from 'react';
import { connect } from 'react-redux';
import {
    array,
    bool,
    string,
    PropTypes,
} from 'prop-types';
import {
    Button, Responsive,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _join from 'lodash/join';
import _slice from 'lodash/slice';
import _map from 'lodash/map';
import _property from 'lodash/property';
import getConfig from 'next/config';

import { withTranslation } from '../i18n';
import {
    getBeneficiaryFromSlug,
} from '../actions/charity';
import Layout from '../components/shared/Layout';
import CharityProfileWrapper from '../components/charity';
import {
    Router,
    Link,
} from '../routes';
import '../static/less/charityProfile.less';
import storage from '../helpers/storage';
import { resetFlowObject } from '../actions/give';


const actionTypes = {
    RESET_CHARITY_STATES: 'RESET_CHARITY_STATES',
};

class CharityProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        req,
        query,
    }) {
        reduxStore.dispatch({
            type: actionTypes.RESET_CHARITY_STATES,
        });
        let auth0AccessToken = null;
        if (typeof window === 'undefined') {
            auth0AccessToken = storage.get('auth0AccessToken', 'cookie', req.headers.cookie);
        }
        await reduxStore.dispatch(getBeneficiaryFromSlug(query.slug, auth0AccessToken));
        return {
            namespacesRequired: [
                'charityProfile',
                'common',
            ],
            slug: query.slug,
        };
    }

    componentDidMount() {
        const {
            redirectToDashboard,
        } = this.props;
        if (redirectToDashboard) {
            Router.push('/search');
        }
    }

    render() {
        const { publicRuntimeConfig } = getConfig();

        const {
            APP_URL_ORIGIN,
            RAILS_APP_URL_ORIGIN,
        } = publicRuntimeConfig;
        const {
            charityDetails: {
                attributes: {
                    avatar,
                    causes,
                    city,
                    description,
                    name,
                    province,
                    slug,
                    hideGive,
                },
            },
            dispatch,
            isAUthenticated,
            redirectToDashboard,
            t: formatMessage,
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
        let buttonLink = null;
        if (!hideGive) {
            if (isAUthenticated) {
                buttonLink = (
                    <Link route={(`/give/to/charity/${slug}/gift/new`)}>
                        <Button className="blue-btn-rounded-def" onClick={() => { resetFlowObject('charity', dispatch); }}>{formatMessage('charityProfile:give')}</Button>
                    </Link>
                );
            } else {
                buttonLink = (
                    <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${slug}/gift/new`)}>
                        <Button className="blue-btn-rounded-def">{formatMessage('charityProfile:give')}</Button>
                    </a>
                );
            }
        }
        return (
            <div>
                <Layout
                    avatar={avatar}
                    keywords={keywords}
                    title={title}
                    description={charityDescription}
                    url={url}
                    isCharityPage
                >
                    {!redirectToDashboard
                        && <CharityProfileWrapper {...this.props} />
                    }
                </Layout>
                <Responsive className="ch_MobGive" maxWidth={767} minWidth={320}>
                    {buttonLink}
                </Responsive>
            </div>
        );
    }
}

CharityProfile.defaultProps = {
    charityDetails: {
        attributes: {
            avatar: '',
            causes: [],
            city: '',
            description: '',
            hideGive: false,
            name: '',
            province: '',
            slug: '',
        },
        type: '',
    },
    dispatch: () => {},
    isAUthenticated: false,
    redirectToDashboard: false,
    slug: '',
    t: () => {},
};

CharityProfile.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            causes: array,
            city: string,
            description: string,
            hideGive: bool,
            name: string,
            province: string,
            slug: string,
        }),
        type: string,
    }),
    dispatch: PropTypes.func,
    isAUthenticated: bool,
    redirectToDashboard: bool,
    slug: string,
    t: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        beneficiaryFinance: state.charity.beneficiaryFinance,
        charityDetails: state.charity.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
        redirectToDashboard: state.charity.redirectToDashboard,
    };
}

const connectedComponent = withTranslation('charityProfile')(connect(mapStateToProps)(CharityProfile));
export {
    connectedComponent as default,
    CharityProfile,
    mapStateToProps,
};
