import { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import { actionTypes, getGroupFromSlug } from "../actions/group";
import storage from "../helpers/storage";
import { withTranslation } from '../i18n';
import {
    Router,
} from '../routes';
import ManageGivingGroup from '../components/ManageGivingGroup';


const GroupProfileEdit = (props) => {
    const {
        slug,
        groupDetails: {
            attributes: {
                isCampaign,
            },
        },
        redirectToPrivateGroupErrorPage,
        redirectToDashboard,
    } = props;
    useEffect(() => {
        if (isCampaign) {
            Router.pushRoute(`/campaigns/${slug}`);
        }
        if (redirectToDashboard) {
            Router.push('/search');
        }
        if (redirectToPrivateGroupErrorPage) {
            Router.pushRoute('/group/error');
        }
    }, []);
    return (
        <Fragment>
            {(!isCampaign && !redirectToDashboard && !redirectToPrivateGroupErrorPage) &&
                <ManageGivingGroup {...props} />
            }
        </Fragment>
    );
}

GroupProfileEdit.getInitialProps = async ({
    reduxStore,
    req,
    query,
}) => {
    let auth0AccessToken = null;
    if (typeof window === 'undefined') {
        auth0AccessToken = storage.get('auth0AccessToken', 'cookie', req.headers.cookie);
    }
    await reduxStore.dispatch(getGroupFromSlug(query.slug, auth0AccessToken));
    return {
        namespacesRequired: [
            'common',
        ],
        slug: query.slug,
        step: query.step,
        substep: query.substep,
    };
}

const mapStateToProps = (state) => {
    return {
        groupDetails: state.group.groupDetails,
        redirectToDashboard: state.group.redirectToDashboard,
        redirectToPrivateGroupErrorPage: state.group.redirectToPrivateGroupErrorPage,
    };
}
GroupProfileEdit.defaultProps = {
    dispatch: () => { },
    groupDetails: {
        attributes: {
            isCampaign: false,
            slug: '',
        },
    },
    redirectToDashboard: false,
    redirectToPrivateGroupErrorPage: false,
    t: () => { },
};

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(GroupProfileEdit));
export {
    connectedComponent as default,
    GroupProfileEdit,
    mapStateToProps,
};


