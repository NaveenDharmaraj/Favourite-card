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
    string, 
    bool,
    array, 
    func,
    object,
    PropTypes,
} from 'prop-types';

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
                currentUser: {
                    id,
                },
                campaignDetails: {
                    attributes: {
                        groupId: profileId,
                    }
                },
                dispatch,
            } = this.props;
            let deepLinkApiUrl = `deeplink?profileType=campaignprofile&profileId=${profileId}`;
            if (!_isEmpty(id)) {
                deepLinkApiUrl += `sourceId=${id}`;
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
            subgroupCount,
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
            groupMatchingHistory: {
                data: matchHistory,
            },
        } = this.props;
        const bannerStyle = {};
        let campaignBannerClassName = 'ch_headerImage greenBg greenBgnew ';
        if (!_isEmpty(banner)) {
            bannerStyle.backgroundImage = `url( ${banner})`;
            campaignBannerClassName = 'CampaigBanner ch_headerImage greenBg greenBgnew';
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
                                <Grid.Column mobile={16} tablet={10} computer={11}>
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
                                                        hasActiveMatch={hasActiveMatch}
                                                    />
                                                </ProfileTitle>
                                            )}
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
                                                            matchHistory={matchHistory}
                                                        />
                                                    )
                                                }
                                            </Responsive>
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
                                                        matchHistory={matchHistory}
                                                        subgroupCount={subgroupCount}
                                                    />
                                                </React.Fragment>
                                            )
                                        }
                                    </Grid.Row>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={5} >
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
                                                    matchHistory={matchHistory}
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

CampaignProfileWrapper.defaultProps = {
    campaignDetails: {
        attributes: {
            about: '',
            avatar: '',
            causes: [],
            city: '',
            liked: false,
            groupId: '',
            name: '',
            province: '',
            banner: '',
            peopleInCampaign: '',
            groupsCount: '',
            slug: '',
            amountRaised: '',
            hasActiveMatch: false,
            activeMatch: false,
            videoPlayerLink: '',
            formattedShort: '',
            formattedImpact: '',
        },
        id: '',
        type: '',
    },
    campaignImageGallery: [],
    campaignSubGroupDetails: [],
    campaignSubGroupsShowMoreUrl: '',
    currentUser: PropTypes.shape({
        id: '',
    }),
    deepLink: {},
    dispatch: () => { },
    groupMatchingHistory: {
        data: [],
    },
    isAuthenticated: false,
    seeMoreLoaderStatus: false,
    subGroupListLoader: false,
};

CampaignProfileWrapper.PropTypes = {
    campaignDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            about: string,
            avatar: string,
            causes: object,
            city: string,
            liked: false,
            groupId: string,
            name: string,
            province: string,
            banner: string,
            peopleInCampaign: string,
            groupsCount: string,
            slug: string,
            amountRaised: string,
            hasActiveMatch: false,
            activeMatch: false,
            videoPlayerLink: string,
            formattedShort: string,
            formattedImpact: string,
        }),
        type: string,
        id: string,
    }),
    campaignImageGallery: array,
    campaignSubGroupDetails: array,
    campaignSubGroupsShowMoreUrl: string,
    currentUser: PropTypes.shape({
        id: string,
    }),
    deepLink: object,
    dispatch: func,
    groupMatchingHistory: PropTypes.shape({
        data: array,
    }),
    isAuthenticated: bool,
    seeMoreLoaderStatus: bool,
    subGroupListLoader: bool,
};

export default CampaignProfileWrapper;
