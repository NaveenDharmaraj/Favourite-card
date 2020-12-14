/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Card,
    Button,
    Grid,
    Image
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import {
    array,
    bool,
    string,
    number,
    PropTypes,
} from 'prop-types';

import {
    getUserAdminGroup,
} from '../../../actions/userProfile';
import PlaceholderGrid from '../../shared/PlaceHolder';
import ProfileCard from '../../shared/ProfileCard';
import {
    getLocation,
    getPrivacyType,
    displayRecordCount,
    displaySeeMoreButton,
} from '../../../helpers/profiles/utils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
import NoDataManagedGroup_Image from '../../../static/images/givinggroupsyoumanage_nodata_illustration.png';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const {
    HELP_CENTRE_URL,
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class UserAdminGroupList extends React.Component {
    constructor(props) {
        super(props);
        const {
            userProfileAdminGroupData: {
                data: adminData,
            },
        } = props;
        this.state = {
            currentPageNumber: _isEmpty(adminData) ? 1 : Math.floor(_size(adminData)/10),
            show: false,
        };
        this.showAdminCard = this.showAdminCard.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
            userProfileAdminGroupData: {
                data: adminData,
            },
        } = this.props;
        const {
            currentPageNumber
        } = this.state;
        _isEmpty(adminData) && dispatch(getUserAdminGroup(friendUserId, id, currentPageNumber, false));
    }

    showAdminCard() {
        const {
            userProfileAdminGroupData: {
                data: adminData,
            },
            userFriendProfileData: {
                attributes: {
                    profile_type,
                },
            },
            previewMode: {
                isPreviewMode,
            },
        } = this.props;
        const adminArray = [];
        if (!_isEmpty(adminData)) {
            adminData.map((admin) => {
                adminArray.push(
                    <ProfileCard
                        avatar={admin.attributes.avatar}
                        type="Giving Group"
                        name={admin.attributes.name}
                        causes={admin.attributes.groupType}
                        isMyProfile={(profile_type === 'my_profile')}
                        isCampaign={!_isEmpty(admin.attributes.is_campaign) ? admin.attributes.is_campaign : false}
                        Profiletype={!_isEmpty(admin.attributes.type) ? admin.attributes.type : 'group'}
                        location={getLocation(admin.attributes.city, admin.attributes.province)}
                        slug={admin.attributes.slug}
                        isPreviewMode={isPreviewMode}
                        canEdit
                        totalMoneyRaised={admin.attributes.totalMoneyRaised}
                    />,
                );
            });
        }
        return adminArray;
    }
    handleSeeMore = () => {
        const {
            currentPageNumber
        } = this.state;
        const {
            currentUser: {
                id,
            },
            dispatch,
            friendUserId,
        } = this.props;
        dispatch(getUserAdminGroup(friendUserId, id, currentPageNumber + 1, true))
            .then(() => {
                this.setState((prevState) => ({
                    currentPageNumber: prevState.currentPageNumber + 1
                }))
            })
            .catch((err) => {
                // handle error
            })
    }
    render() {
        const {
            previewMode: {
                isPreviewMode,
            },
            userProfileAdminGroupData: {
                data: adminData,
                totalUserAdminGroupRecordCount,
            },
            userFriendProfileData: {
                attributes: {
                    giving_group_manage_visibility,
                    profile_type,
                },
            },
            userProfileAdminGroupsLoadStatus,
            userProfileUserAdminGroupSeeMoreLoader,
        } = this.props;
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(giving_group_manage_visibility);
        let noData = null;
        if (isMyProfile) {
            noData = (
                <div className="ggManage noData">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Image src={NoDataManagedGroup_Image} className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                        Groups you manage will appear here
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <a href={`${RAILS_APP_URL_ORIGIN}/groups/step/one`}>
                                            <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                        </a>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            );
        } else {
            noData = (
                <div className="nodata-friendsprfl">
                    Nothing to show here yet
                </div>
            );
        }
        let dataElement = '';
        if (!_isEmpty(adminData)) {
            dataElement = (
                <div className="cardwrap">
                    {this.showAdminCard()}
                </div>
            );
        } else {
            dataElement = noData;
        }
        return (
            <div className="userPrfl_tabSec">
                <div className="tabHeader">
                    <Header>Managed Giving Groups</Header>
                    {(isMyProfile && !isPreviewMode)
                        && (
                            <ProfilePrivacySettings
                                columnName='giving_group_manage_visibility'
                                columnValue={giving_group_manage_visibility}
                                iconName={currentPrivacyType}
                            />
                        )}
                </div>
                {userProfileAdminGroupsLoadStatus
                    ? <PlaceholderGrid row={2} column={3} />
                    : dataElement
                }
                <div className="seeMoreBtnWrap">
                    {
                        (!_isEmpty(adminData) && (_size(adminData) < totalUserAdminGroupRecordCount)) &&
                        displaySeeMoreButton(userProfileUserAdminGroupSeeMoreLoader, this.handleSeeMore)
                    }
                    {totalUserAdminGroupRecordCount > 0 && displayRecordCount(adminData, totalUserAdminGroupRecordCount)}
                </div>
            </div>
        );
    }
}

UserAdminGroupList.defaultProps = {
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            giving_group_manage_visibility: null,
            profile_type: '',
        },
    },
    userProfileAdminGroupData: {
        data: [],
        totalUserAdminGroupRecordCount: 0,
    },
    userProfileAdminGroupsLoadStatus: true,
};

UserAdminGroupList.propTypes = {
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            giving_group_manage_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileAdminGroupData: PropTypes.shape({
        data: array,
        totalUserAdminGroupRecordCount: number,
    }),
    userProfileAdminGroupsLoadStatus: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileAdminGroupData: state.userProfile.userProfileAdminGroupData,
        userProfileAdminGroupsLoadStatus: state.userProfile.userProfileAdminGroupsLoadStatus,
        userProfileUserAdminGroupSeeMoreLoader: state.userProfile.userProfileUserAdminGroupSeeMoreLoader,
    };
}

export default (connect(mapStateToProps)(UserAdminGroupList));
