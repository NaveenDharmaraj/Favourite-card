import React from 'react';
import {
    Popup,
    List,
    Icon,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEqual from 'lodash/isEqual';

import { withTranslation } from '../../../i18n';
import {
    savePrivacySetting,
} from '../../../actions/userProfile';
import {
    getPrivacyType,
} from '../../../helpers/profiles/utils';

class ProfilePrivacySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopUpOpen: false,
            privacyType: getPrivacyType(props.columnValue),
        };
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            userFriendProfileData,
            columnName,
        } = this.props;
        if (!_isEqual(prevProps.userFriendProfileData.attributes[columnName],
            userFriendProfileData.attributes[columnName])) {
            this.setState({
                privacyType: getPrivacyType(userFriendProfileData.attributes[columnName]),
            });
        }
    }

    openPopup() {
        this.setState({
            isPopUpOpen: true,
        });
    }

    closePopup() {
        this.setState({
            isPopUpOpen: false,
        });
    }

    handlePrivacyChange(value) {
        const {
            columnName,
            dispatch,
            currentUser: {
                attributes: {
                    email,
                },
                id: userId,
            },
        } = this.props;
        savePrivacySetting(dispatch, userId, email, columnName, value).then(() => {
            this.closePopup();
        });
    }

    render() {
        const {
            isPopUpOpen,
            privacyType,
        } = this.state;
        return (
            <Popup
                on="click"
                pinned
                position="bottom right"
                className="privacySetting-popup"
                basic
                open={isPopUpOpen}
                onClose={this.closePopup}
                trigger={(
                    <a
                        className={(isPopUpOpen) ? 'privacySettingIcon active' : 'privacySettingIcon'}
                        onClick={this.openPopup}
                    >
                        <Icon className={privacyType} />
                        <Icon className="chevron down" />
                    </a>
                )}
            >
                <Popup.Header>Visible to:</Popup.Header>
                <Popup.Content>
                    <List divided verticalAlign="middle" className="selectable-tick-list">
                        <List.Item className={`${(privacyType === 'globe') ? 'active' : ''}`}>
                            <List.Content>
                                <List.Header as="a" onClick={() => this.handlePrivacyChange(0)}>
                                    <Icon className="globe" />
                                    Public
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item className={`${(privacyType === 'users') ? 'active' : ''}`}>
                            <List.Content>
                                <List.Header as="a" onClick={() => this.handlePrivacyChange(1)}>
                                    <Icon className="users" />
                                    Friends
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item className={`${(privacyType === 'lock') ? 'active' : ''}`}>
                            <List.Content>
                                <List.Header as="a" onClick={() => this.handlePrivacyChange(2)}>
                                    <Icon className="lock" />
                                    Only me
                                </List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                </Popup.Content>
            </Popup>
        );
    }
}

ProfilePrivacySettings.defaultProps = {
    columnName: '',
    columnValue: null,
    currentUser: {
        attributes: {
            email: '',
        },
        id: null,
    },
    dispatch: () => {},
    userFriendProfileData: {
        attributes: {},
    },
};

ProfilePrivacySettings.propTypes = {
    columnName: string,
    columnValue: number,
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            email: string,
        }),
        id: number,
    }),
    dispatch: func,
    userFriendProfileData: PropTypes.shape({
        attributes: PropTypes.shape({}),
    }),
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userFriendProfileData: state.userProfile.userFriendProfileData,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(ProfilePrivacySettings));
export {
    connectedComponent as default,
    ProfilePrivacySettings,
    mapStateToProps,
};
