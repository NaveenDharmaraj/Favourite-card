import React from 'react';
import {
    Header,
    Button,
} from 'semantic-ui-react';

// eslint-disable-next-line react/prefer-stateless-function
class Support extends React.Component {
    handleStartChatClick() {
        Beacon("open");
    }

    render() {
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading brdr-btm pb-1">
                        <Header as="h4">Support </Header>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Live chat</p>
                        <p>
                            Chat live with a client success team member.
                            Our team is available from Monday to Friday, 9am to 5pm (Pacific Time)
                        </p>
                        <Button
                            className="success-btn-rounded-def"
                            onClick={this.handleStartChatClick}
                        >
                            Message
                        </Button>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Help Centre</p>
                        <p>
                            Our 
                            {' '}
                            <a href="https://help.chimp.net/" target="_blank">Help Centre</a>
                            {' '}
                            has answers to common questions.
                        </p>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Contact Us</p>
                        <p>
                            <p>
                            Phone: 1-877-531-0580
                                <br />
                            Monday to Friday, 9am to 5pm (Pacific Time)
                            </p>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Support;
