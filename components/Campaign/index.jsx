/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import React from 'react';
import _isEmpty from 'lodash/isEmpty';

import {
    campaignSubGroupSeeMore,
    generateDeepLink,
} from '../../actions/profile';
import BreadcrumbDetails from '../shared/BreadCrumbs';
import ProfilePageHead from '../shared/ProfilePageHead';
import {
    Container,
    Grid
} from 'semantic-ui-react';
import CampaignDetails from './CampaignDetails';
import ProfileDetails from './ProfileDetails';
import ProfileTitle from '../shared/ShareTitle';

const actionTypes = {
    SEE_MORE_LOADER: 'SEE_MORE_LOADER',
};
class CampaignProfileWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.viewMoreFn = this.viewMoreFn.bind(this);
    }

    componentDidMount() {
        const {
            deepLink,
        } = this.props;
        if (_isEmpty(deepLink)) {
            const {
                currentUser,
                campaignDetails,
                dispatch,
            } = this.props;
            let deepLinkApiUrl = `deeplink?profileType=campaignprofile&profileId=${campaignDetails.attributes.groupId}`;
            if (currentUser && currentUser.id) {
                deepLinkApiUrl += `sourceId=${currentUser.id}`;
            }
            generateDeepLink(deepLinkApiUrl, dispatch);
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
            campaignSubGroupSeeMore(campaignSubGroupsShowMoreUrl, dispatch, true);
        }
    }

    render() {
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
        const {
            campaignDetails: {
                attributes: {
                    avatar,
                    causes,
                    city,
                    liked,
                    fundName,
                    groupId,
                    name,
                    province,
                    banner,
                },
                type,
            },
        } = this.props;
        const bannerStyle = { };
        let campaignBannerClassName = 'ch_headerImage greenBg';
        if (!_isEmpty(banner)) {
            bannerStyle.backgroundImage = `url( ${banner})`;
            campaignBannerClassName = 'CampaigBanner ch_headerImage greenBg';
        }
        let locationDetails = '';
        if (_isEmpty(city) && !_isEmpty(province)) {
            locationDetails = province;
        } else if (!_isEmpty(city) && _isEmpty(province)) {
            locationDetails = city;
        } else if (!_isEmpty(city) && !_isEmpty(province)) {
            locationDetails = `${city}, ${province}`;
        }
        const pathDetails = [
            'Explore',
            'Campaigns',
            name,
        ];
        return (
            <React.Fragment>
                <div className="top-breadcrumb">
                    <BreadcrumbDetails
                        pathDetails={pathDetails}
                    />
                </div>
                <div className="CampaignWapper">
                    <Container>
                        <div
                            className={campaignBannerClassName}
                            style={bannerStyle}
                        />
                        <Grid.Row>
                            <Grid>
                                <Grid.Column mobile={16} tablet={11} computer={11}>
                                    <Grid.Row>
                                        <Grid>
                                            {campaignDetails && (
                                                <ProfileTitle
                                                    avatar={avatar}
                                                    causes={causes}
                                                    // beneficiaryType={beneficiaryType}
                                                    type={type}
                                                    location={locationDetails}
                                                    following={liked}
                                                    name={fundName}
                                                    profileId={groupId}
                                                >
                                                    <ProfilePageHead
                                                        pageDetails={campaignDetails}
                                                    />
                                                </ProfileTitle>
                                            )}
                                            {
                                                campaignDetails && (
                                                    <CampaignDetails
                                                        campaignDetails={campaignDetails}
                                                        isAuthenticated={isAuthenticated}
                                                        deepLinkUrl={deepLinkUrl}
                                                        dispatch={dispatch}
                                                        disableFollow={disableFollow}
                                                        userId={(currentUser && currentUser.id) ? currentUser.id : ''}
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
                                        </Grid>
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid>
                        </Grid.Row>

                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default CampaignProfileWrapper;
