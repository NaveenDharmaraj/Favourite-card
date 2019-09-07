import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    Divider,
    Button,
    Header,
} from 'semantic-ui-react';
import {
    arrayOf,
    PropTypes,
    string,
    number,
    func,
} from 'prop-types';

import PlaceholderGrid from '../shared/PlaceHolder';
import {
    getDetails,
} from '../../actions/group';
import FriendCard from '../shared/FriendCard';

class Members extends React.Component {
    static loadCards(data) {
        return (
            <Grid stackable doubling columns={7}>
                <Grid.Row stretched>
                    {data.map((card) => (
                        <FriendCard
                            avatar={card.attributes.avatar}
                            name={card.attributes.displayName}
                        />
                    ))}
                </Grid.Row>
            </Grid>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            adminsLoader: !props.groupAdminsDetails.data.length > 0,
            membersLoader: !props.groupMembersDetails.data.length > 0,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
            groupMembersDetails: {
                data: membersData,
            },
            groupAdminsDetails: {
                data: adminData,
            },
        } = this.props;
        if (_isEmpty(membersData)) {
            getDetails(dispatch, groupId, 'members');
        }
        if (_isEmpty(adminData)) {
            getDetails(dispatch, groupId, 'admins');
        }
    }

    componentDidUpdate(prevProps) {
        const {
            groupMembersDetails: {
                data: memberData,
            },
            groupAdminsDetails: {
                data: adminData,
            },
        } = this.props;
        let {
            membersLoader,
            adminsLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(memberData, prevProps.groupMembersDetails.data)) {
                membersLoader = false;
            }
            this.setState({
                membersLoader,
            });

            if (!_.isEqual(adminData, prevProps.groupAdminsDetails.data)) {
                adminsLoader = false;
            }
            this.setState({
                adminsLoader,
            });
        }
    }

    loadMore(type) {
        const {
            dispatch,
            groupDetails: {
                id,
            },
            groupAdminsDetails: {
                nextLink: adminsNextLink,
            },
            groupMembersDetails: {
                nextLink: membersNextLink,
            },
        } = this.props;
        let replacedUrl = '';
        switch (type) {
            case 'Admins':
                replacedUrl = (adminsNextLink) ? adminsNextLink : '';
                getDetails(dispatch, id, 'admins', replacedUrl);
                break;
            case 'Members':
                replacedUrl = (membersNextLink) ? membersNextLink : '';
                getDetails(dispatch, id, 'members', replacedUrl);
                break;
            default:
                break;
        }
    }

    render() {
        const {
            groupMembersDetails: {
                data: membersData,
                nextLink: membersNextLink,
            },
            groupAdminsDetails: {
                data: adminsData,
                nextLink: adminsNextLink,
            },
        } = this.props;
        const {
            membersLoader,
            adminsLoader,
        } = this.state;
        return (
            <Fragment>
                <div className="give-friends-list pt-2">
                    {(adminsData.length > 0)
                        && (
                            <Header as="h4">
                                    Admins
                            </Header>
                        )
                    }
                    <Divider />
                    {adminsLoader ? <PlaceholderGrid row={1} column={7} />
                        : Members.loadCards(adminsData)}
                    {(adminsNextLink)
                    && (
                        <div className="text-center mt-1 mb-1">
                            <Button
                                onClick={() => this.loadMore('Admins')}
                                className="blue-bordr-btn-round-def w-180"
                                content="View more"
                            />
                        </div>
                    )
                    }
                </div>

                <div className="give-friends-list pt-2">
                    {(membersData.length > 0)
                    && (
                        <Header as="h4">
                            Members
                        </Header>
                    )
                    }
                    <Divider />
                    {membersLoader ? <PlaceholderGrid row={1} column={7} />
                        : Members.loadCards(membersData)}

                    {(membersNextLink)
                    && (
                        <div className="text-center mt-1 mb-1">
                            <Button
                                onClick={() => this.loadMore('Members')}
                                className="blue-bordr-btn-round-def w-180"
                                content="View more"
                            />
                        </div>
                    )
                    }
                </div>
            </Fragment>
        );
    }
}

Members.defaultProps = {
    dispatch: func,
    groupAdminsDetails: {
        data: [],
        links: {
            next: '',
        },
    },
    groupDetails: {
        id: null,
    },
    groupMembersDetails: {
        data: [],
        links: {
            next: '',
        },
    },
};

Members.propTypes = {
    dispatch: _.noop,
    groupAdminsDetails: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
    groupDetails: {
        id: number,
    },
    groupMembersDetails: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
};

function mapStateToProps(state) {
    return {
        groupAdminsDetails: state.group.groupAdminsDetails,
        groupDetails: state.group.groupDetails,
        groupMembersDetails: state.group.groupMembersDetails,
    };
}

export default connect(mapStateToProps)(Members);
