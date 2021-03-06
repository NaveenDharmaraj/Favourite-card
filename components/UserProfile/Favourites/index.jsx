/* eslint-disable react/prop-types */
import React from 'react';
import {
    Header,
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
    actionTypes,
    getUserFavourites,
} from '../../../actions/userProfile';
import {
    getLocation,
    getPrivacyType,
    displayRecordCount,
    displaySeeMoreButton,
} from '../../../helpers/profiles/utils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
import PlaceholderGrid from '../../shared/PlaceHolder';
import ProfileCard from '../../shared/ProfileCard';
import NoDataFavoritesGroup from '../../../static/images/favourites-illo-desktop.png';
import NoDataState from '../NoDataState';

class FavouritesList extends React.Component {
    constructor(props) {
        super(props);
        const {
            userProfileFavouritesData: {
                data: favouritesData,
            },
        } = props;
        this.state = {
            currentPageNumber: _isEmpty(favouritesData) ? 1 : Math.floor(_size(favouritesData) / 10),
            pageSize: 10,
        }
    }
    componentDidMount() {
        const {
            dispatch,
            friendUserId,
        } = this.props;
        const {
            currentPageNumber
        } = this.state;
        dispatch(getUserFavourites(friendUserId, currentPageNumber, false));
    }
    componentWillUnmount() {
        const {
            dispatch
        } = this.props;
        dispatch({
            type: actionTypes.USER_PROFILE_FAVOURITES_CLEAR_DATA,
            payload: {}
        })
    }
    showMemberCard() {
        const {
            userFriendProfileData: {
                attributes: {
                    profile_type,
                },
            },
            userProfileFavouritesData: {
                data: favouritesData,
                totalUserFavouritesRecordCount,
                totalUserFavouritesPageCount,
            },
            previewMode: {
                isPreviewMode,
            },
        } = this.props;
        const {
            currentPageNumber,
            pageSize
        } = this.state;
        const memberArray = [];
        if (!_isEmpty(favouritesData)) {
            favouritesData.map((favourite) => {
                let locationDetails = '';
                if (!_isEmpty(favourite.attributes.city)
                    && !_isEmpty(favourite.attributes.province)) {
                    locationDetails = getLocation(favourite.attributes.city, favourite.attributes.province);
                }
                memberArray.push(
                    <ProfileCard
                        avatar={favourite.attributes.avatar}
                        type={(favourite.attributes.type === 'group') ? 'GIVING GROUP' : 'CHARITY'}
                        name={favourite.attributes.name}
                        causes={!_isEmpty(favourite.attributes.groupType) ? favourite.attributes.groupType : ''}
                        isMyProfile={(profile_type === 'my_profile')}
                        isCampaign={!_isEmpty(favourite.attributes.is_campaign) ? favourite.attributes.is_campaign : false}
                        Profiletype={!_isEmpty(favourite.attributes.type) ? favourite.attributes.type : 'group'}
                        location={locationDetails}
                        slug={favourite.attributes.slug}
                        isPreviewMode={isPreviewMode}
                        canEdit={false}
                        isFavourite
                        entityId={favourite.attributes.type === 'charity' ? favourite.attributes.charity_id : favourite.attributes.group_id}
                        currentPageNumber={currentPageNumber}
                        pageSize={pageSize}
                        favouritesData={favouritesData}
                        totalUserFavouritesRecordCount={totalUserFavouritesRecordCount}
                        totalUserFavouritesPageCount={totalUserFavouritesPageCount}
                    />,
                );
            });
        }
        return memberArray;
    }
    handleSeeMore = () => {
        const {
            currentPageNumber
        } = this.state;
        const {
            dispatch,
            friendUserId,
        } = this.props;
        dispatch(getUserFavourites(friendUserId, currentPageNumber + 1, true))
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
            userFriendProfileData: {
                attributes: {
                    favourites_visibility,
                    profile_type,
                },
            },
            userProfileFavouritesLoadStatus,
            userProfileFavouritesData: {
                data: favouritesData,
                totalUserFavouritesRecordCount,
            },
            userProfileUserFavouritesSeeMoreLoader,
        } = this.props;
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(favourites_visibility);
        let noData = null;
        if (isMyProfile) {
            noData = (
                <NoDataState
                    className="ggJoin ggFavorite noData"
                    image={NoDataFavoritesGroup}
                    content="Your favourite charities and Giving Groups will appear here"
                    route="/search?result_type=All"
                    ror={false}
                    btnClass="white-btn-rounded-def"
                    btnTitle="Find a charity or Giving Group"
                />
            );
        } else {
            noData = (
                <div className="nodata-friendsprfl">
                    Nothing to show here yet
                </div>
            );
        }
        let dataElement = '';
        if (!_isEmpty(favouritesData)) {
            dataElement = (
                <div className="cardwrap">
                    {this.showMemberCard()}
                </div>
            );
        } else {
            dataElement = noData;
        }
        return (
            <div className="userPrfl_tabSec">
                <div className="tabHeader">
                    <Header>Favourites</Header>
                    {(isMyProfile && !isPreviewMode)
                        && (
                            <ProfilePrivacySettings
                                columnName='favourites_visibility'
                                columnValue={favourites_visibility}
                                iconName={currentPrivacyType}
                            />
                        )}
                </div>
                {
                    userProfileFavouritesLoadStatus
                        ? (
                            <PlaceholderGrid row={1} column={6} placeholderType='CardNew' />
                        )
                        : dataElement
                }
                <div className="seeMoreBtnWrap">
                    {
                        (!_isEmpty(favouritesData) && (_size(favouritesData) < totalUserFavouritesRecordCount)) &&
                        displaySeeMoreButton(userProfileUserFavouritesSeeMoreLoader, this.handleSeeMore)
                    }
                    {totalUserFavouritesRecordCount > 0 && displayRecordCount(favouritesData, totalUserFavouritesRecordCount)}
                </div>
            </div>
        );
    }
}

FavouritesList.defaultProps = {
    previewMode: {
        isPreviewMode: false,
    },
    userFriendProfileData: {
        attributes: {
            favourites_visibility: null,
            profile_type: '',
        },
    },
    userProfileFavouritesData: {
        data: [],
        totalUserFavouritesRecordCount: 0,
        totalUserFavouritesPageCount: 0,
    },
    userProfileFavouritesLoadStatus: true,
};

FavouritesList.propTypes = {
    previewMode: PropTypes.shape({
        isPreviewMode: bool,
    }),
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({
            favourites_visibility: number,
            profile_type: string,
        }),
    }),
    userProfileFavouritesData: PropTypes.shape({
        data: array,
        totalUserFavouritesRecordCount: number,
        totalUserFavouritesPageCount: number,
    }),
    userProfileFavouritesLoadStatus: bool,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        previewMode: state.userProfile.previewMode,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileFavouritesData: state.userProfile.userProfileFavouritesData,
        userProfileFavouritesLoadStatus: state.userProfile.userProfileFavouritesLoadStatus,
        userProfileUserFavouritesSeeMoreLoader: state.userProfile.userProfileUserFavouritesSeeMoreLoader,
    };
}


export default (connect(mapStateToProps)(FavouritesList));
