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

import {
    getUserFavourites,
} from '../../../actions/userProfile';
import placeholderCharity from '../../../static/images/no-data-avatar-charity-profile.png';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

class FavouritesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favouritesListLoader: !props.userProfileFavouritesData,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            friendUserId,
        } = this.props;
        getUserFavourites(dispatch, friendUserId);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            userProfileFavouritesData,
        } = this.props;
        let {
            favouritesListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userProfileFavouritesData, prevProps.userProfileFavouritesData)) {
                favouritesListLoader = false;
            }
            this.setState({
                favouritesListLoader,
            });
        }
    }

    favouriteList() {
        const {
            userProfileFavouritesData,
        } = this.props;
        let favouritesList = 'Nothing to show here yet.';
        if (userProfileFavouritesData
            && userProfileFavouritesData.data
            && _.size(userProfileFavouritesData.data) > 0) {
            favouritesList = userProfileFavouritesData.data.map((data) => {
                const entityName = data.attributes.name;
                let locationDetails = '';
                const locationDetailsCity = (!_.isEmpty(data.attributes.city)) ? data.attributes.city : '';
                const locationDetailsProvince = (!_.isEmpty(data.attributes.province)) ? data.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${data.attributes.city}, ${data.attributes.province}`;
                }
                const type = data.attributes.type === 'group' ? 'giving group' : 'charity';
                const typeClass = data.attributes.type === 'group' ? 'chimp-lbl group' : 'chimp-lbl charity';
                const placeholder = data.attributes.type === 'group' ? placeholderGroup : placeholderCharity;
                const imageType = (!_.isEmpty(data.attributes.avatar)) ? data.attributes.avatar : placeholder;
                const urlEntity = data.attributes.type === 'group' ? 'groups' : 'charities';
                const url = `/${urlEntity}/${data.attributes.slug}`;
                return (
                    <LeftImageCard
                        entityName={entityName}
                        location={locationDetails}
                        placeholder={imageType}
                        typeClass={typeClass}
                        type={type}
                        url={url}
                    />
                );
            });
        }
        return (
            <Grid columns="equal" stackable doubling columns={3}>
                <Grid.Row>
                    {
                        (_.size(userProfileFavouritesData.data) > 0) && (
                            <React.Fragment>
                                {favouritesList}
                            </React.Fragment>
                        )
                    }
                    {
                        (_.size(userProfileFavouritesData.data) === 0) && (
                            <Grid.Column>
                                {favouritesList}
                            </Grid.Column>
                        )
                    }
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {
            favouritesListLoader,
        } = this.state;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                    Favourites
                    </Header>
                    { favouritesListLoader ? <PlaceholderGrid row={1} column={3} /> : (
                        this.favouriteList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileFavouritesData: state.userProfile.userProfileFavouritesData,
    };
}


export default (connect(mapStateToProps)(FavouritesList));
