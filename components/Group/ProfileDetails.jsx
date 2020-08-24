import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    string,
    bool,
    number,
    func,
    PropTypes,
} from 'prop-types';
import {
    Tab,
    Grid,
    Divider,
} from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';

import Activity from './Activity';
import Members from './Members';
import DonationDetails from './DonationDetails';
// import CharitySupport from './CharitySupport';
// import TransactionDetails from './TransactionDetails';

class ProfileDetails extends React.Component {
    constructor(props) {
        super(props);
        this.tabRef = React.createRef();
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        const {
            current: {
                offsetTop,
            },
        } = this.tabRef;
        dispatch({
            payload: {
                scrollOffset: offsetTop,
            },
            type: 'GET_GROUP_TAB_OFFSET',
        });
    }

    handleTabChange(event, data) {
        const {
            dispatch,
            updatedActiveIndex,
        } = this.props;
        if (!_isEqual(updatedActiveIndex, data.activeIndex)) {
            dispatch({
                payload: {
                    activeIndex: data.activeIndex,
                },
                type: 'GET_GROUP_TAB_INDEX',
            });
        }
    }

    render() {
        const {
            isAuthenticated,
            groupDetails: {
                id,
            },
            updatedActiveIndex,
        } = this.props;
        let panes = [];
        if (isAuthenticated) {
            panes = [
                {
                    id: 'Activity',
                    menuItem: 'Activity',
                    render: () => (
                        <Tab.Pane attached={false}>
                            {(isAuthenticated)
                            && (
                                <Activity
                                    id={id}
                                />
                            )}
                        </Tab.Pane>
                    ),
                },
                {
                    id: 'Members',
                    menuItem: 'Members',
                    render: () => (
                        <Tab.Pane attached={false}>
                            {(isAuthenticated)
                            && (
                                <Members />
                            )}
                        </Tab.Pane>
                    ),
                },
                // {
                //     id: 'Transactions',
                //     menuItem: 'Transactions',
                //     render: () => (
                //         <Tab.Pane attached={false}>
                //             {(isAuthenticated)
                //                 && (
                //                     <TransactionDetails
                //                         id={id}
                //                     />
                //                 )}
                //         </Tab.Pane>
                //     ),
                // },
                // {
                //     id: 'supports',
                //     menuItem: 'Charities this group supports',
                //     render: () => (
                //         <Tab.Pane attached={false}>
                //             {(isAuthenticated)
                //             && (
                //                 <CharitySupport
                //                     id={id}
                //                 />
                //             )}
                //         </Tab.Pane>
                //     ),
                // },
            ];
        }
        return (
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} className="GroupTab">
                    <div className="charityTab tabBottom" ref={this.tabRef}>
                        {isAuthenticated
                            ? (
                                <Tab
                                    menu={{
                                        pointing: true,
                                        secondary: true,
                                    }}
                                    panes={panes}
                                    defaultActiveIndex={0}
                                    activeIndex={updatedActiveIndex}
                                    onTabChange={this.handleTabChange}
                                />
                            )
                            : (
                                <Fragment>
                                    <Divider />
                                    <DonationDetails />
                                </Fragment>
                            )}
                    </div>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

ProfileDetails.defaultProps = {
    dispatch: () => {},
    groupDetails: {
        attributes: {
            formattedAbout: '',
            formattedHelping: '',
            formattedImpact: '',
            formattedShort: '',
            videoPlayerLink: '',
        },
        id: '',
    },
    isAuthenticated: false,
    updatedActiveIndex: 0,
};

ProfileDetails.propTypes = {
    dispatch: func,
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            formattedAbout: string,
            formattedHelping: string,
            formattedImpact: string,
            formattedShort: string,
            videoPlayerLink: string,
        }),
        id: string,
    }),
    isAuthenticated: bool,
    updatedActiveIndex: number,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
        updatedActiveIndex: state.group.activeIndex,
    };
}

export default connect(mapStateToProps)(ProfileDetails);
