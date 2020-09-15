import React, {
    Fragment,
} from 'react';
import {
    Popup,
    List,
    Icon,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';

class ProfilePrivacySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopUpOpen: false,
        };
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
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

    render() {
        const {
            isPopUpOpen,
        } = this.state;
        const {
            iconName,
        } = this.props;
        debugger;
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
                        className="privacySettingIcon"
                        onClick={this.openPopup}
                    >
                        <Icon className={iconName} />
                        <Icon className="chevron down" />
                    </a>
                )}
            >
                <Popup.Header>Visible to:</Popup.Header>
                <Popup.Content>
                    <List divided verticalAlign="middle" className="selectable-tick-list">
                        <List.Item>
                            <List.Content>
                                <List.Header as="a">
                                    <Icon className="globe" />
                                    Public
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <List.Header as="a">
                                    <Icon className="users" />
                                    Friends
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <List.Header as="a">
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
    iconName: '',
};

ProfilePrivacySettings.propTypes = {
    iconName: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
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
