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
import { manageGivingGroupAccordianMenuOptions, manageGivingGroupAccordianOptions } from '../helpers/createGrouputils';


const GroupProfileEdit = (props) => {
    const {
        slug,
        groupDetails: {
            attributes: {
                isAdmin,
                isCampaign,
            },
        },
        redirectToPrivateGroupErrorPage,
        redirectToDashboard,
        step,
        substep,
    } = props;
    useEffect(() => {
        if (isCampaign) {
            Router.pushRoute(`/campaigns/${slug}`);
        } else if (redirectToDashboard) {
            Router.push('/search');
        } else if (redirectToPrivateGroupErrorPage) {
            Router.pushRoute('/group/error');
            return;
        } else if (_isEmpty(manageGivingGroupAccordianOptions[step]) && _isEmpty(substep)) {
            Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions['edit'].route}`);
            return;
        } else if (substep && _isEmpty(manageGivingGroupAccordianMenuOptions[substep])) {
            Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions['edit'].route}/${manageGivingGroupAccordianMenuOptions['basic'].route}`)
        } else if (!isAdmin) {
            Router.pushRoute(`/groups/${slug}`);
        }
    }, []);
    return (
        <Fragment>
            {(isAdmin && !isCampaign && !redirectToDashboard && !redirectToPrivateGroupErrorPage) &&
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
    try {
        let auth0AccessToken = null;
        if (typeof window === 'undefined') {
            auth0AccessToken = storage.get('auth0AccessToken', 'cookie', req.headers.cookie);
        }
        await reduxStore.dispatch(getGroupFromSlug(query.slug, auth0AccessToken, true));
        return {
            namespacesRequired: [
                'common',
            ],
            slug: query.slug,
            step: query.step,
            substep: query.substep,
        };
    }
    catch (err) {
        //handle error
    }
    return {}
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


