/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Container,
    Header,
    Image,
    Grid,
    Card,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getFriendsList,
    storeEmailIdToGive,
} from '../../../actions/dashboard';
import { Link } from '../../../routes';
import placeholderUser from '../../../static/images/no-data-avatar-user-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import noDataFriends from '../../../static/images/dashboard_nodata_illustration.png';

class FriendsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            friendListLoader: !props.friendsData,
        };
        this.giveButtonClick = this.giveButtonClick.bind(this);
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
        } = this.props;
        getFriendsList(dispatch, currentUser.attributes.email);
        this.lazyLoadImage();
    }
    componentDidUpdate(prevProps, prevState) {
        const {
            friendsData,
        } = this.props;
        let {
            friendListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(friendsData, prevProps.friendsData)) {
                friendListLoader = false;
            }
            this.setState({
                friendListLoader,
            });
        }
        if (!_.isEqual(this.state.friendListLoader, prevState.friendListLoader)) {
            this.lazyLoadImage();
        }
    }
    lazyLoadImage = () => {
        const options = {
            root: null,
            threshold: 0,
            rootMargin: '0px 0px 0px 0px',
        };
        const _imageElements = document.querySelectorAll('.friends-lazyLoad');
        if ('IntersectionObserver' in window) {
            // LazyLoad images using IntersectionObserver
            const imgObserver = new IntersectionObserver(((entries, imgObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return
                    } else {
                        this.preloadImage(entry.target);
                        imgObserver.unobserve(entry.target);
                    }
                });
            }), options);
            _imageElements.forEach((element) => {
                imgObserver.observe(element);
            });
        } else {
            // Load all images at once
            _imageElements.forEach((element) => {
                this.preloadImage(element)
            });
        }

    };

    preloadImage = (img) => {
        const src = img.getAttribute('data-src');
        if (!src) {
            return;
        }
        if(img.firstChild){
            img.firstChild.src = src;
            return;
        };
        img.src = src;
    };
    giveButtonClick(email, name, image) {
        const {
            dispatch,
        } = this.props;
        storeEmailIdToGive(dispatch, email, name, image);
    }

    // eslint-disable-next-line class-methods-use-this
    noDataFriendsList() {
        return (
            <Grid.Column width={16}>
                <div className="friendsNoData noData mt-1 mb-2">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Image data-src={noDataFriends} className="noDataLeftImg friends-lazyLoad" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                            Connect with people you know on Charitable Impact.
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <Link className="lnkChange" route="/user/profile/friends/findFriends">
                                            <Button className="success-btn-rounded-def">Find friends</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Grid.Column>
        );
    }

    friendsList() {
        const {
            friendsData,
        } = this.props;
        let friendsList = this.noDataFriendsList();
        if (friendsData && friendsData.data && _.size(friendsData.data) > 0) {
            friendsList = friendsData.data.map((data, index) => {
                const name = `${data.attributes.first_name} ${data.attributes.last_name}`;
                const email = Buffer.from(data.attributes.email_hash, 'base64').toString('ascii');
                if (typeof data.attributes.avatar === 'undefined') {
                    data.attributes.avatar = placeholderUser;
                }
                return (
                    <Grid.Column key={index}>
                        <Card>
                            <Link route={`/users/profile/${data.attributes.user_id}`} passHref>
                                <Image
                                    className="pointer friends-lazyLoad"
                                    src={''}
                                    data-src={data.attributes.avatar}
                                    circular
                                />
                            </Link>
                            <Card.Content>
                                <Card.Header>{name}</Card.Header>
                                <Card.Description>
                                    <Link className="lnkChange" route="/give/to/friend/new" passHref>
                                        <Button className="give-frnds-btn" onClick={() => this.giveButtonClick(email, name, data.attributes.avatar)}>Give</Button>
                                    </Link>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                );
            });
        }
        return (
            <div className="give-friends-list pt-2">
                {
                    friendsData && friendsData.data && _.size(friendsData.data) > 0 && (
                        <Grid columns="equal" stackable doubling columns={7}>
                            <Grid.Row stretched>
                                <Grid.Column>
                                    <Card className="createGift" verticalAlign="middle">
                                        <Card.Content>
                                            <Card.Header>Find friends to give to </Card.Header>
                                            <Card.Description>
                                                <Link className="lnkChange" route="/user/profile/friends/findFriends" passHref>
                                                    <Button className="give-frnds-btn">Find friends</Button>
                                                </Link>
                                            </Card.Description>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                                {friendsList}
                            </Grid.Row>
                        </Grid>
                    )
                }
                {
                    _.size(friendsData.data) === 0 && (
                        <div>
                            {friendsList}
                        </div>
                    )
                }
            </div>
        );
    }

    render() {
        const {
            friendListLoader,
        } = this.state;
        const {
            friendsData,
        } = this.props;
        let viewAllDiv = null;
        if (friendsData && friendsData.count > 6) {
            viewAllDiv = (
                <div className="text-right">
                    <Link className="lnkChange" route="/user/profile/friends/myFriends">
                        <a className="viewAll">
                            View all
                            {/* (
                            {friendsData.count}
                            ) */}
                        </a>
                    </Link>
                </div>
            );
        }
        return (
            <div className="pt-2 pb-2">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={11} tablet={12} computer={12}>
                                <Header as="h3">
                                    <Header.Content>
                                        Give to your friends
                                        <span className="small">Send them charitable dollars that they can give away.</span>
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                            <Grid.Column mobile={5} tablet={4} computer={4}>
                                {viewAllDiv}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {friendListLoader ? <PlaceholderGrid row={1} column={7} /> : (
                        this.friendsList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        friendsData: state.dashboard.friendsData,
    };
}


export default (connect(mapStateToProps)(FriendsList));
