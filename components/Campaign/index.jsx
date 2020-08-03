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
            deepLink,
        } = this.props;
        if (attributes.name) {
            pathDetails.push(attributes.name);
        }
        this.setState({
            pathDetails,
        });
        if (_.isEmpty(deepLink)) {
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
        const {
            campaignDetails: {
                attributes: {
                    avatar,
                    causes,
                    city,
                    liked,
                    fundName,
                    groupId,
                    province,
                    banner,
                },
                type
            }
        } = this.props;
        let bannerStyle = {
            minHeight: '390px',
        };
        if (banner) {
            bannerStyle.backgroundImage = `url( ${banner})`;
        }
        let locationDetails = '';
        if (_isEmpty(city) && !_isEmpty(province)) {
            locationDetails = province;
        } else if (!_isEmpty(city) && _isEmpty(province)) {
            locationDetails = city;
        } else if (!_isEmpty(city) && !_isEmpty(province)) {
            locationDetails = `${city}, ${province}`;
        }
        return (
            <React.Fragment>
                <div className="top-breadcrumb">
                    <BreadcrumbDetails
                        pathDetails={pathDetails}
                    />
                </div>
                <div className="CampaignWapper">
                    <Container>
                        <div className='CampaigBanner ch_headerImage greenBg'></div>
                        <Grid.Row>
                            <Grid>
                                <Grid.Column mobile={16} tablet={11} computer={11} >
                                    <Grid.Row>
                                        <Grid>
                                            {campaignDetails && (
                                                <ProfileTitle
                                                    avatar={avatar}
                                                    causes={causes}
                                                    type={type} 
                                                    location={locationDetails} 
                                                    following={liked} 
                                                    name={fundName} 
                                                    profileId={groupId}  
                                                >
                                                    <ProfilePageHead
                                                        pageDetails={campaignDetails}
                                                        isAuthenticated={isAuthenticated}
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
