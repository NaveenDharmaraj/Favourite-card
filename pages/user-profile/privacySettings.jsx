import React from 'react';
import {
    Popup,
    List,
    Icon
} from 'semantic-ui-react';

import '../../static/less/userProfile.less';

class PrivacySettings extends React.Component {
    constructor(props) {
        super(props);
 
        this.state = {
            isPopUpOpen: false,
            iconName : props.iconName
        };

    }
    render() {
        return (
            <Popup
                trigger={<a className="privacySettingIcon" onClick={() => { this.setState({ isPopUpOpen: true }); }}><Icon className={this.state.iconName}/><Icon className='chevron down'></Icon></a>}
                on="click"
                pinned
                position="bottom right"
                className="privacySetting-popup"
                basic
                open={this.state.isPopUpOpen}   
                onClose={() => { this.setState({ isPopUpOpen: false }); }}    
            >
                <Popup.Header>Visible to:</Popup.Header>
                <Popup.Content>
                    <List divided verticalAlign="middle" className="selectable-tick-list">
                        <List.Item >
                            <List.Content>
                                <List.Header as="a">
                                   <Icon className="globe"/> Public
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item >
                            <List.Content>
                                <List.Header as="a">
                                <Icon className="users"/> Friends
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item >
                            <List.Content>
                                <List.Header as="a">
                                <Icon className="lock"/> Only me
                                </List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                </Popup.Content>
            </Popup>
        );
    }
}

export default PrivacySettings;
