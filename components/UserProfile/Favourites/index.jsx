/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    array,
    bool,
    string,
    number,
    PropTypes,
} from 'prop-types';

import {
    getUserFavourites,
} from '../../../actions/userProfile';

import {
    getLocation,
    getPrivacyType,
} from '../../../helpers/profiles/utils';
import ProfilePrivacySettings from '../../shared/ProfilePrivacySettings';
import placeholderCharity from '../../../static/images/no-data-avatar-charity-profile.png';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';
import ProfileCard from '../../shared/ProfileCard';

class FavouritesList extends React.Component {
    componentDidMount() {
        const {
            dispatch,
            friendUserId,
        } = this.props;
        getUserFavourites(dispatch, friendUserId);
    }

    // componentWillUnmount() {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     dispatch({
    //         payload: {
    //         },
    //         type: 'USER_PROFILE_FAVOURITES',
    //     });
    // }

    // favouriteList() {
    //     const {
    //         userProfileFavouritesData,
    //     } = this.props;
    //     let favouritesList = 'Nothing to show here yet.';
    //     if (userProfileFavouritesData
    //         && userProfileFavouritesData.data
    //         && _.size(userProfileFavouritesData.data) > 0) {
    //         favouritesList = userProfileFavouritesData.data.map((data) => {
    //             const entityName = data.attributes.name;
    //             let locationDetails = '';
    //             const locationDetailsCity = (!_.isEmpty(data.attributes.city)) ? data.attributes.city : '';
    //             const locationDetailsProvince = (!_.isEmpty(data.attributes.province)) ? data.attributes.province : '';
    //             if (locationDetailsCity === '' && locationDetailsProvince !== '') {
    //                 locationDetails = locationDetailsProvince;
    //             } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
    //                 locationDetails = locationDetailsCity;
    //             } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
    //                 locationDetails = `${data.attributes.city}, ${data.attributes.province}`;
    //             }
    //             const type = data.attributes.type === 'group' ? 'giving group' : 'charity';
    //             const typeClass = data.attributes.type === 'group' ? 'chimp-lbl group' : 'chimp-lbl charity';
    //             const placeholder = data.attributes.type === 'group' ? placeholderGroup : placeholderCharity;
    //             const imageType = (!_.isEmpty(data.attributes.avatar)) ? data.attributes.avatar : placeholder;
    //             const urlEntity = data.attributes.type === 'group' ? 'groups' : 'charities';
    //             const url = `/${urlEntity}/${data.attributes.slug}`;
    //             return (
    //                 <LeftImageCard
    //                     entityName={entityName}
    //                     location={locationDetails}
    //                     placeholder={imageType}
    //                     typeClass={typeClass}
    //                     type={type}
    //                     url={url}
    //                 />
    //             );
    //         });
    //     }
    //     return (
    //         <Grid columns="equal" stackable doubling columns={3}>
    //             <Grid.Row>
    //                 {
    //                     !_.isEmpty(userProfileFavouritesData) && (_.size(userProfileFavouritesData.data) > 0) && (
    //                         <React.Fragment>
    //                             {favouritesList}
    //                         </React.Fragment>
    //                     )
    //                 }
    //                 {
    //                     !_.isEmpty(userProfileFavouritesData) && (_.size(userProfileFavouritesData.data) === 0) && (
    //                         <Grid.Column>
    //                             {favouritesList}
    //                         </Grid.Column>
    //                     )
    //                 }
    //             </Grid.Row>
    //         </Grid>
    //     );
    // }

    showMemberCard() {
        const {
            userFriendProfileData: {
                attributes: {
                    profile_type,
                },
            },
            userProfileFavouritesData: {
                data: favouritesData,
            },
            previewMode: {
                isPreviewMode,
            },
        } = this.props;
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
                    />,
                );
            });
        }
        return memberArray;
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
            },
        } = this.props;
        const isMyProfile = (profile_type === 'my_profile');
        const currentPrivacyType = getPrivacyType(favourites_visibility);
        let noData = null;
        if (isMyProfile) {
            noData = <p>NO DATA MY PROFILE</p>;
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
                {userProfileFavouritesLoadStatus
                    ? (
                        <PlaceholderGrid row={2} column={3} />
                    )
                    : dataElement}
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
    };
}


export default (connect(mapStateToProps)(FavouritesList));
