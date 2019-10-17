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
        getFriendsList(dispatch, currentUser.attributes.email)
    }

    componentDidUpdate(prevProps) {
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
    }

    giveButtonClick(email) {
        const {
            dispatch,
        } = this.props;
        storeEmailIdToGive(dispatch, email);
    }

    // eslint-disable-next-line class-methods-use-this
    noDataFriendsList() {
        return (
            <Grid.Column width={16}>
                <div className="friendsNoData noData mt-1 mb-2">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Image src={noDataFriends} className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                        Connect with people you know on Charitable Impact.
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <Link className="lnkChange" route="/user/profile/friends/findfriends">
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
                            <Link  route={`/users/profile/${data.attributes.user_id}`}>
                                <Image
                                    className="pointer"
                                    src={data.attributes.avatar}
                                    circular
                                />
                            </Link>
                            <Card.Content>
                                <Card.Header>{name}</Card.Header>
                                <Card.Description>
                                    <Link className="lnkChange" route="/give/to/friend/new">
                                        <Button className="give-frnds-btn" onClick={() => this.giveButtonClick(email)}>Give</Button>
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
                                                <Link className="lnkChange" route="/user/profile/friends/findfriends">
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
                    <Link className="lnkChange" route="/user/profile/friends/myfriends">
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
                    { friendListLoader ? <PlaceholderGrid row={1} column={7} /> : (
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
