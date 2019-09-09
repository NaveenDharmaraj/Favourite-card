import React from 'react';
import { connect } from 'react-redux';
import {
    string,
    bool,
} from 'prop-types';
import {
    Container,
    Tab,
} from 'semantic-ui-react';

import Activity from './Activity';
import Members from './Members';
import CharitySupport from './CharitySupport';
import TransactionDetails from './TransactionDetails';

const ProfileDetails = (props) => {
    const {
        isAUthenticated,
        groupDetails: {
            id,
            attributes: {
                description,
            },
        },
    } = props;
    let panes = [
        {
            id: 'About',
            menuItem: 'About',
            render: () => (
                <Tab.Pane attached={false}>
                    <p>{description}</p>
                </Tab.Pane>
            ),
        },
    ];

    if (isAUthenticated) {
        panes = panes.concat(
            {
                id: 'Activity',
                menuItem: 'Activity',
                render: () => (
                    <Tab.Pane attached={false}>
                        <Activity
                            id={id}
                        />
                    </Tab.Pane>
                ),
            },
            {
                id: 'Members',
                menuItem: 'Members',
                render: () => (
                    <Tab.Pane attached={false}>
                        {(isAUthenticated)
                        && (
                            <Members />
                        )}
                    </Tab.Pane>
                ),
            },
            {
                id: 'Transactions',
                menuItem: 'Transactions',
                render: () => (
                    <Tab.Pane attached={false}>
                        {(isAUthenticated)
                            && (
                                <TransactionDetails
                                    id={id}
                                />
                            )}
                    </Tab.Pane>
                ),
            },
            {
                id: 'supports',
                menuItem: 'Charities this group supports',
                render: () => (
                    <Tab.Pane attached={false}>
                        {(isAUthenticated)
                        && (
                            <CharitySupport
                                id={id}
                            />
                        )}
                    </Tab.Pane>
                ),
            },
        );
    }

    return (
        <Container>
            <div className="charityTab">
                <Tab
                    menu={{
                        pointing: true,
                        secondary: true,
                    }}
                    panes={panes}
                />
            </div>
        </Container>
    );
};


ProfileDetails.defaultProps = {
    groupDetails: {
        attributes: {
            description: null,
        },
    },
    isAUthenticated: false,
};

ProfileDetails.propTypes = {
    groupDetails: {
        attributes: {
            description: string,
        },
    },
    isAUthenticated: bool,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(ProfileDetails);
