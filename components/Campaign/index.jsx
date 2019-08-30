/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';

import {
    campaignSubGroupSeeMore,
    generateDeepLink,
} from '../../actions/profile';
import BreadcrumbDetails from '../shared/BreadCrumbs';
import ProfilePageHead from '../shared/ProfilePageHead';

import CampaignDetails from './CampaignDetails';
import ProfileDetails from './ProfileDetails';

const actionTypes = {
    SEE_MORE_LOADER: 'SEE_MORE_LOADER',
};
class CharityProfileWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathDetails: [
                'Explore',
                'Campaigns',
            ],
        };
        this.viewMoreFn = this.viewMoreFn.bind(this);
    }

    componentDidMount() {
        const {
            pathDetails,
        } = this.state;
        const {
            campaignDetails: {
                attributes,
            },
        } = this.props;
        if (attributes.name) {
            pathDetails.push(attributes.name);
        }
        this.setState({
            pathDetails,
        });
        if (_.isEmpty(this.props.deepLink)) {
            generateDeepLink(`deeplink?profileType=groupprofile&sourceId=${this.props.userId}&profileId=${this.props.campaignDetails.id}`, this.props.dispatch);
        }
    }

    viewMoreFn() {
        const {
            dispatch,
            campaignSubGroupsShowMoreUrl,
        } = this.props;
        if (campaignSubGroupsShowMoreUrl) {
            dispatch({
                payload: {
                    seeMoreLoaderStatus: true,
                },
                type: actionTypes.SEE_MORE_LOADER,
            });
            campaignSubGroupSeeMore(campaignSubGroupsShowMoreUrl, dispatch);
        }
    }

    render() {
        const {
            pathDetails,
        } = this.state;
        const {
            campaignDetails,
            campaignImageGallery,
            campaignSubGroupDetails,
            campaignSubGroupsShowMoreUrl,
            currentUser,
            deepLinkUrl,
            dispatch,
            disableFollow,
            seeMoreLoaderStatus,
            subGroupListLoader,
            isAuthenticated,
        } = this.props;
        return (
            <React.Fragment>
                <div className="top-breadcrumb">
                    <BreadcrumbDetails
                        pathDetails={pathDetails}
                    />
                </div>
                <div className="profile-header-image campaign" />

                {campaignDetails && (
                    <ProfilePageHead
                        pageDetails={campaignDetails}
                        isAuthenticated={isAuthenticated}
                    />
                )}
                {
                    campaignDetails && (
                        <CampaignDetails
                            campaignDetails={campaignDetails}
                            isAuthenticated={isAuthenticated}
                            deepLinkUrl={deepLinkUrl}
                            dispatch={dispatch}
                            disableFollow={disableFollow}
                            userId={(currentUser && currentUser.id) ? currentUser.id: ''}
                        />
                    )
                }
                {
                    campaignDetails && (
                        <ProfileDetails
                            campaignDetails={campaignDetails}
                            campaignImageGallery={campaignImageGallery}
                            campaignSubGroupDetails={campaignSubGroupDetails}
                            campaignSubGroupsShowMoreUrl={campaignSubGroupsShowMoreUrl}
                            isAuthenticated={isAuthenticated}
                            seeMoreLoaderStatus={seeMoreLoaderStatus}
                            subGroupListLoader={subGroupListLoader}
                            viewMoreFn={this.viewMoreFn}
                        />
                    )
                }
            </React.Fragment>
        );
    }
}

export default CharityProfileWrapper;
