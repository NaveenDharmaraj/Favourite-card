/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
import React from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Container,
    Grid,
    Responsive,
} from 'semantic-ui-react';

import {
    campaignSubGroupSeeMore,
    generateDeepLink,
} from '../../actions/profile';
import BreadcrumbDetails from '../shared/BreadCrumbs';
import ProfilePageHead from '../shared/ProfilePageHead';
import ProfileTitle from '../shared/ProfileTitle';

import ProfileDetails from './ProfileDetails';
import CampaignDetails from './CampaignDetails';
import SupportingGroups from './SupportingGroups';

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
            dispatch(campaignSubGroupSeeMore(campaignSubGroupsShowMoreUrl,true));
        }
    }

    render() {
        const {
            campaignDetails,
            campaignImageGallery,
            campaignSubGroupDetails,
            campaignSubGroupsShowMoreUrl,
            seeMoreLoaderStatus,
            subGroupListLoader,
            isAuthenticated,
        } = this.props;
        const {
            campaignDetails: {
                attributes: {
                    about,
                    avatar,
                    causes,
                    city,
                    liked,
                    groupId,
                    name,
                    province,
                    banner,
                    peopleInCampaign,
                    groupsCount,
                    slug,
                    amountRaised,
                    hasActiveMatch,
                    activeMatch,
                    videoPlayerLink,
                    formattedShort,
                    formattedImpact,
                },
                type,
                id,
            },
            dispatch,
        } = this.props;
        const bannerStyle = {};
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
                                <Grid.Column mobile={16} tablet={10} computer={12}>
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
                                                    name={name}
                                                    profileId={groupId}
                                                >
                                                    <ProfilePageHead
                                                        pageDetails={campaignDetails}
                                                        dispatch={dispatch}
                                                    />
                                                </ProfileTitle>
                                            )}
                                            <Grid.Column mobile={16}>
                                                <Responsive minWidth={320} maxWidth={767}>
                                                    {
                                                        campaignDetails && (
                                                            <CampaignDetails
                                                                activeMatch={activeMatch}
                                                                hasActiveMatch={hasActiveMatch}
                                                                peopleInCampaign={peopleInCampaign}
                                                                groupsCount={groupsCount}
                                                                slug={slug}
                                                                amountRaised={amountRaised}
                                                                isAuthenticated={isAuthenticated}
                                                                type={type}
                                                            />
                                                        )
                                                    }
                                                </Responsive>
                                            </Grid.Column>
                                        </Grid>
                                        {
                                            campaignDetails && (
                                                <React.Fragment>
                                                    <ProfileDetails
                                                        about={about}
                                                        videoPlayerLink={videoPlayerLink}
                                                        formattedShort={formattedShort}
                                                        formattedImpact={formattedImpact}
                                                        campaignImageGallery={campaignImageGallery}
                                                        isAuthenticated={isAuthenticated}
                                                    />
                                                    <SupportingGroups
                                                        campaignId={id}
                                                        slug={slug}
                                                        campaignSubGroupDetails={campaignSubGroupDetails}
                                                        campaignSubGroupsShowMoreUrl={campaignSubGroupsShowMoreUrl}
                                                        seeMoreLoaderStatus={seeMoreLoaderStatus}
                                                        subGroupListLoader={subGroupListLoader}
                                                        viewMoreFn={this.viewMoreFn}
                                                    />
                                                </React.Fragment>
                                            )
                                        }
                                    </Grid.Row>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={4} >
                                    <Responsive minWidth={768}>
                                        {
                                            campaignDetails && (
                                                <CampaignDetails
                                                    activeMatch={activeMatch}
                                                    hasActiveMatch={hasActiveMatch}
                                                    peopleInCampaign={peopleInCampaign}
                                                    groupsCount={groupsCount}
                                                    slug={slug}
                                                    amountRaised={amountRaised}
                                                    isAuthenticated={isAuthenticated}
                                                    type={type}
                                                />
                                            )
                                        }
                                    </Responsive>
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
