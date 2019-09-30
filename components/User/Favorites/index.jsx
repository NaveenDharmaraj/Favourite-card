import React from 'react';
import _ from 'lodash';
import {
    Header,
    Container,
    Grid,
    Card,
    Image,
    Button,
    Icon,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    bool,
    func,
    oneOfType,
    number,
    PropTypes,
    string,
} from 'prop-types';

import {
    getFavoritesList,
    removeFavorite,
} from '../../../actions/user';
import charityImg from '../../../static/images/no-data-avatar-charity-profile.png';
import groupImg from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import { Link } from '../../../routes';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import { renderText } from '../../../helpers/utils';
import noDataggFavourites from '../../../static/images/favourites_nodata_illustration.png';

class Favorites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favoritesLoader: !props.favorites,
            loader: false,
            pageSize: 9,
        };
        this.handleSeeMore = this.handleSeeMore.bind(this);
        this.callRemoveFav = this.callRemoveFav.bind(this);
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        getFavoritesList(dispatch, currentUser.id, 1, this.state.pageSize);
    }

    componentDidUpdate(prevProps) {
        const {
            favorites,
        } = this.props;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(favorites, prevProps.favorites)) {
                this.setState({
                    favoritesLoader: false,
                    loader: false,
                });
            }
        }
    }

    checkForData() {
        const {
            favorites,
        } = this.props;
        if (!_.isEmpty(favorites) && favorites.data && _.size(favorites.data) > 0) {
            return true;
        }
        return false;
    }

    callRemoveFav(removeId, type) {
        const {
            favorites: {
                data,
                currentPageNumber,
                dataCount,
                pageCount,
            },
            dispatch,
            currentUser,
        } = this.props;
        dismissAllUxCritialErrors(dispatch);
        const item = (type === 'charity') ? _.find(data, { attributes: { charity_id: removeId } })
            : _.find(data, { attributes: { group_id: removeId } });
        if (item) {
            dispatch({
                payload: {
                },
                type: 'DISABLE_FAVORITES_BUTTON',
            });
            removeFavorite(dispatch, removeId, currentUser.id, data, type, dataCount, this.state.pageSize, currentPageNumber, pageCount);
        }
    }

    showFavorites() {
        const {
            favorites,
        } = this.props;
        let favoritesList = (
            <Grid.Column width={16}>
                <div className="favouritesNoData noData mt-1 mb-2">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Image src={noDataggFavourites} className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                        Charities or Giving Groups you favourite will appear here
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <Link route="/search">
                                            <Button className="white-btn-rounded-def">Find charities, groups, and causes</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Grid.Column>
        );
        if (this.checkForData()) {
            favoritesList = favorites.data.map((data, index) => {
                const {
                    avatar,
                    name,
                    type,
                    slug,
                    is_campaign,
                } = data.attributes;
                let displayAvatar = charityImg;
                const shortName = renderText(name, 3);
                let route = 'charities';
                let heading = 'charity';
                if (type === 'group') {
                    displayAvatar = groupImg;
                    route = (is_campaign) ? 'campaigns' : 'groups';
                    heading = 'giving group';
                }
                displayAvatar = (!_.isEmpty(avatar)) ? avatar : displayAvatar;
                const entityId = (type === 'charity') ? data.attributes.charity_id : data.attributes.group_id;
                return (
                    <Grid.Column key={index}>
                        <Card className="left-img-card" fluid>
                            <Card.Header>
                                <Grid>
                                    <Grid.Column width={6}>
                                        <Image src={displayAvatar} />
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <div className="">
                                            <Header as="h4">
                                                <Header.Content>
                                                    <Header.Subheader className={`chimp-lbl ${type}`}>
                                                        {heading}
                                                        <span className="more-icon">
                                                            <Icon name="heart" disabled={this.props.disableFavorites} onClick={() => this.callRemoveFav(entityId, type)} />
                                                        </span>
                                                    </Header.Subheader>
                                                    {shortName}
                                                </Header.Content>
                                            </Header>
                                            <Link className="lnkChange" route={`/${route}/${slug}`}>
                                                <Button className="btn-small-white-border">View</Button>
                                            </Link>
                                        </div>
                                    </Grid.Column>
                                </Grid>
                            </Card.Header>
                        </Card>
                    </Grid.Column>
                );
            });
        }
        return (
            <Grid stackable doubling columns={3}>
                <Grid.Row>
                    {favoritesList}
                </Grid.Row>
            </Grid>
        );
    }

    handleSeeMore() {
        const {
            currentUser,
            dispatch,
            favorites,
        } = this.props;
        const {
            pageSize,
        } = this.state;
        if (favorites.currentPageNumber < favorites.pageCount) {
            getFavoritesList(dispatch, currentUser.id, favorites.currentPageNumber + 1, pageSize);
            dismissAllUxCritialErrors(dispatch);
            this.setState({
                loader: true,
            });
        }
    }

    renderSeeMore() {
        if (this.checkForData()) {
            const {
                loader,
            } = this.state;
            const {
                favorites,
            } = this.props;
            if (_.size(favorites.data) < favorites.dataCount) {
                const content = (
                    <div className="text-centre">
                        <Button
                            className="blue-bordr-btn-round-def"
                            onClick={() => this.handleSeeMore()}
                            loading={!!loader}
                            disabled={!!loader}
                            content="See more"
                        />
                    </div>
                );
                return content;
            }
        }
        return null;
    }

    renderCount() {
        if (this.checkForData()) {
            const {
                favorites,
            } = this.props;
            const countText = `Showing ${_.size(favorites.data)} of ${favorites.dataCount}`;
            return (
                <div className="result">{countText}</div>
            );
        }
        return null;
    }

    render() {
        const {
            favoritesLoader,
        } = this.state;
        return (
            <div className="pt-2 pb-2">
                <Container>
                    <div className="pt-2 favourite">
                        { (favoritesLoader) ? <PlaceholderGrid row={2} column={3} /> : (
                            this.showFavorites()
                        )}
                        <div className="seeMore bigBtn">
                            {this.renderSeeMore()}
                            {this.renderCount()}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

Favorites.defaultProps = {
    currentUser: {
        id: null,
    },
    dispatch: _.noop,
    favoritesLoader: true,
    disableFavorites: false,
};

Favorites.propTypes = {
    currentUser: PropTypes.shape({
        id: oneOfType([
            number,
            string,
        ]),
    }),
    dispatch: func,
    favorites: PropTypes.shape({
        dataCount : oneOfType([
                    number,
                    string,
        ]),
        pageCount : oneOfType([
            number,
            string,
        ]),
        currentPageNumber : oneOfType([
            number,
            string,
        ]),
    }),
    disableFavorites: bool,
};


function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        disableFavorites: state.user.disableFavorites,
        favorites: state.user.favorites,
    };
}


export default (connect(mapStateToProps)(Favorites));
