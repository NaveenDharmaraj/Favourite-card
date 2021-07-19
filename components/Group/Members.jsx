import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import {
    Grid,
    Button,
    Table,
} from 'semantic-ui-react';
import {
    array,
    PropTypes,
    string,
    number,
    func,
    bool,
} from 'prop-types';

import {
    Link,
} from '../../routes';
import { withTranslation } from '../../i18n';
import PlaceholderGrid from '../shared/PlaceHolder';
import {
    getDetails,
} from '../../actions/group';
import Pagination from '../shared/Pagination';

import MemberCard from './MemberCard';

class Members extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
        };
        this.onPageChanged = this.onPageChanged.bind(this);
        this.memberTabref = React.createRef();
    }

    componentDidMount() {
        const {
            dispatch,
            groupDetails: {
                attributes: {
                    isMember,
                    isPrivate,
                },
                id: groupId,
            },
        } = this.props;
        if (isMember || !isPrivate) {
            dispatch(getDetails(groupId, 'members'));
        }
    }

    componentDidUpdate() {
        const {
            current,
        } = this.memberTabref;
        if (!_isEmpty(current)) {
            current.offsetParent.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }

    onPageChanged(event, data) {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
            scrollOffset,
        } = this.props;
        dispatch(getDetails(groupId, 'members', data.activePage));
        this.setState({
            currentActivePage: data.activePage,
        });
        window.scrollTo({
            behavior: 'smooth',
            top: scrollOffset,
        });
    }

    renderMembers() {
        const {
            groupMembersDetails: {
                data: membersData,
            },
        } = this.props;
        const membersList = [];
        membersData.map((member) => {
            membersList.push(
                <MemberCard
                    memberData={member}
                />,
            );
        });
        return membersList;
    }

    render() {
        const {
            groupDetails: {
                attributes: {
                    isAdmin,
                    slug,
                },
            },
            groupMembersDetails: {
                data: membersData,
                pageCount,
                totalCount,
            },
            membersLoader,
            t: formatMessage,
        } = this.props;
        const {
            currentActivePage,
        } = this.state;
        return (
            <div className="tabWapper" ref={this.memberTabref}>
                {!membersLoader
                    ? (
                        <Fragment>
                            <div className={`members ${isAdmin ? 'btn_padding' : ' '}`}>
                                <Grid.Row>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column mobile={8} tablet={8} computer={8}>
                                                {!_isEmpty(membersData)
                                    && (
                                        <div className="membersNumber">
                                            <i aria-hidden="true" className="group icon" />
                                            {` ${totalCount.toLocaleString()} ${(totalCount > 1) ? formatMessage('groupProfile:membersText') : formatMessage('groupProfile:singleMemberText')}`}
                                        </div>
                                    )}
                                            </Grid.Column>
                                            {(isAdmin && !_isEmpty(membersData))
                                            && (
                                                <Grid.Column mobile={8} tablet={8} computer={8}>
                                                    <Link route={`/groups/${slug}/invites`}>
                                                        <Button
                                                            className="success-btn-rounded-def"
                                                            floated="right"
                                                        >
                                                            <span>
                                                                <i aria-hidden="true" className="addmember icon" />
                                                            </span>
                                                            {formatMessage('groupProfile:inviteFriends')}
                                                        </Button>
                                                    </Link>
                                                </Grid.Column>
                                            )}
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Row>
                            </div>
                            <Table basic="very" unstackable className="db-activity-tbl Topborder">
                                {(!_isEmpty(membersData))
                                        && this.renderMembers()}
                            </Table>
                            <div className="paginationWraper group_pagination">
                                <div className="db-pagination">
                                    {
                                        !_isEmpty(membersData) && pageCount > 1 && (
                                            <Pagination
                                                activePage={currentActivePage}
                                                totalPages={pageCount}
                                                onPageChanged={this.onPageChanged}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </Fragment>
                    )
                    : (
                        <Grid className="no-margin">
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <PlaceholderGrid row={4} column={1} placeholderType="activityList" />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
            </div>
        );
    }
}

Members.defaultProps = {
    dispatch: () => {},
    groupDetails: {
        attributes: {
            isAdmin: false,
            slug: '',
        },
        id: null,
    },
    groupMembersDetails: {
        data: [],
        pageCount: null,
        totalCount: null,
    },
    membersLoader: true,
    scrollOffset: 0,
    t: () => {},
};

Members.propTypes = {
    dispatch: func,
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            isAdmin: bool,
            isMember: bool,
            isPrivate: bool,
            slug: string,
        }),
        id: number,
    }),
    groupMembersDetails: PropTypes.shape({
        data: array,
        pageCount: number,
        totalCount: number,
    }),
    membersLoader: bool,
    scrollOffset: number,
    t: func,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        groupMembersDetails: state.group.groupMembersDetails,
        membersLoader: state.group.membersLoader,
        scrollOffset: state.group.scrollOffset,
    };
}

const connectedComponent = withTranslation([
    'groupProfile',
])(connect(mapStateToProps)(Members));
export {
    connectedComponent as default,
    Members,
    mapStateToProps,
};
