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
import getConfig from 'next/config';

import { withTranslation } from '../../i18n';
import PlaceholderGrid from '../shared/PlaceHolder';
import {
    getDetails,
} from '../../actions/group';
import Pagination from '../shared/Pagination';

import MemberCard from './MemberCard';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class Members extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentActivePage: 1,
        };
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        dispatch(getDetails(groupId, 'members'));
    }

    onPageChanged(event, data) {
        const {
            dispatch,
            groupDetails: {
                id: groupId,
            },
        } = this.props;
        dispatch(getDetails(groupId, 'members', data.activePage));
        this.setState({
            currentActivePage: data.activePage,
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
            <div className="tabWapper">
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
                                            {` ${totalCount.toLocaleString()} ${formatMessage('groupProfile:membersText')}`}
                                        </div>
                                    )}
                                            </Grid.Column>
                                            {(isAdmin && !_isEmpty(membersData))
                                            && (
                                                <Grid.Column mobile={8} tablet={8} computer={8}>
                                                    <Button
                                                        className="success-btn-rounded-def"
                                                        floated="right"
                                                        href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/invites`)}
                                                    >
                                                        <span>
                                                            <i aria-hidden="true" className="addmember icon" />
                                                        </span>
                                                        {formatMessage('groupProfile:inviteFriends')}
                                                    </Button>
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
                            <div className="paginationWraper">
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
    t: () => {},
};

Members.propTypes = {
    dispatch: func,
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            isAdmin: bool,
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
    t: func,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        groupMembersDetails: state.group.groupMembersDetails,
        membersLoader: state.group.membersLoader,
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
