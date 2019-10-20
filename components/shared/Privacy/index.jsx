/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Popup,
    List,
    Button,
    Icon,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    savePrivacySetting,
} from '../../../actions/userProfile';

class PrivacySetting extends React.Component {
    constructor(props) {
        super(props);
        const {
            columnName,
            columnValue,
        } = props;
        const {
            friendsLink, onlyMeLink, publicLink, showFriendsIcon, showonlyMeIcon, showPublicIcon,
        } = this.getPrivacySettings(columnName, columnValue);
        this.state = {
            friendsLink,
            isPopUpOpen: false,
            onlyMeLink,
            publicLink,
            savePrivacyName: columnName,
            savePrivacyValue: columnValue,
            showFriendsIcon,
            showonlyMeIcon,
            showPublicIcon,
        };

        this.handleSavePrivacySetting = this.handleSavePrivacySetting.bind(this);
        this.handleCancelPrivacySetting = this.handleCancelPrivacySetting.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            columnName,
            columnValue,
        } = this.props;
        const {
            friendsLink, onlyMeLink, publicLink, showFriendsIcon, showonlyMeIcon, showPublicIcon,
        } = this.getPrivacySettings(columnName, columnValue);
        if (!_.isEqual(columnValue, prevProps.columnValue)) {
            this.setState({
                friendsLink,
                onlyMeLink,
                publicLink,
                savePrivacyName: columnName,
                savePrivacyValue: columnValue,
                showFriendsIcon,
                showonlyMeIcon,
                showPublicIcon,
            });
        }
    }

    // eslint-disable-next-line class-methods-use-this
    getPrivacySettings(columnName, columnValue) {
        let publicLink = '';
        let friendsLink = '';
        let onlyMeLink = '';
        let showFriendsIcon = false;
        let showonlyMeIcon = false;
        let showPublicIcon = false;
        if (Number(columnValue) === 0) {
            publicLink = 'active';
            showPublicIcon = true;
        } else if (Number(columnValue) === 1) {
            friendsLink = 'active';
            showFriendsIcon = true;
        } else if (Number(columnValue) === 2) {
            onlyMeLink = 'active';
            showonlyMeIcon = true;
        }
        return {
            friendsLink,
            onlyMeLink,
            publicLink,
            showFriendsIcon,
            showonlyMeIcon,
            showPublicIcon,
        };
    }

    handlePrivacyClick(type) {
        if (type === 'public') {
            this.setState({
                friendsLink: '',
                onlyMeLink: '',
                publicLink: 'active',
                savePrivacyValue: 0,
                showFriendsIcon: false,
                showonlyMeIcon: false,
                showPublicIcon: true,
            });
        } else if (type === 'friends') {
            this.setState({
                friendsLink: 'active',
                onlyMeLink: '',
                publicLink: '',
                savePrivacyValue: 1,
                showFriendsIcon: true,
                showonlyMeIcon: false,
                showPublicIcon: false,
            });
        } else if (type === 'onlyme') {
            this.setState({
                friendsLink: '',
                onlyMeLink: 'active',
                publicLink: '',
                savePrivacyValue: 2,
                showFriendsIcon: false,
                showonlyMeIcon: true,
                showPublicIcon: false,
            });
        }
    }

    handleSavePrivacySetting() {
        const {
            savePrivacyName,
            savePrivacyValue,
        } = this.state;
        const {
            currentUser: {
                id,
                attributes: {
                    email,
                },
            },
            dispatch,
        } = this.props;
        savePrivacySetting(dispatch, id, email, savePrivacyName, savePrivacyValue);
        this.setState({ isPopUpOpen: false });
    }

    handleCancelPrivacySetting() {
        const {
            columnName,
            columnValue,
        } = this.props;
        const {
            friendsLink, onlyMeLink, publicLink, showFriendsIcon, showonlyMeIcon, showPublicIcon,
        } = this.getPrivacySettings(columnName, columnValue);
        this.setState({
            friendsLink,
            isPopUpOpen: false,
            onlyMeLink,
            publicLink,
            savePrivacyName: columnName,
            savePrivacyValue: columnValue,
            showFriendsIcon,
            showonlyMeIcon,
            showPublicIcon,
        });
    }

    render() {
        const {
            publicLink,
            friendsLink,
            isPopUpOpen,
            onlyMeLink,
            showFriendsIcon,
            showonlyMeIcon,
            showPublicIcon,
        } = this.state;
        return (
            <Popup
                trigger={<a className="font-s-10 d-in-block hoverable" style={{ marginLeft: '.5rem' }} onClick={() => { this.setState({ isPopUpOpen: true }); }}>Privacy settings > </a>}
                on="click"
                pinned
                position="bottom left"
                className="privacy-popup"
                basic
                open={isPopUpOpen}
                onClose={() => { this.setState({ isPopUpOpen: false }); }}
            >
                <Popup.Header>I want this to be visible to:</Popup.Header>
                <Popup.Content>
                    <List divided verticalAlign="middle" className="selectable-tick-list">
                        <List.Item className={publicLink}>
                            <List.Content>
                                <List.Header as="a" onClick={() => this.handlePrivacyClick('public')}>
                                    Public
                                    {' '}
                                    <span style={{ display: showPublicIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item className={friendsLink}>
                            <List.Content>
                                <List.Header as="a" onClick={() => this.handlePrivacyClick('friends')}>
                                    Friends
                                    {' '}
                                    <span style={{ display: showFriendsIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item className={onlyMeLink}>
                            <List.Content>
                                <List.Header as="a" onClick={() => this.handlePrivacyClick('onlyme')}>
                                    Only me
                                    {' '}
                                    <span style={{ display: showonlyMeIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                </List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                </Popup.Content>
                <div className="popup-footer text-center">
                    <Button
                        size="tiny"
                        className="blue-btn-rounded-def"
                        onClick={this.handleSavePrivacySetting}
                    >
                        Save
                    </Button>
                    <Button
                        size="tiny"
                        className="blue-bordr-btn-round-def"
                        onClick={this.handleCancelPrivacySetting}
                    >
                        Cancel
                    </Button>
                </div>
            </Popup>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(PrivacySetting));
