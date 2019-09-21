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
                        <p className="bold">Chat with us </p>
                        <p>
                            Chat live with a client success team member.
                            Our team is available from Monday to Friday,
                            9:00am to 5:00pm (Pacific Time)
                        </p>
                        <Button
                            className="success-btn-rounded-def"
                            onClick={this.handleStartChatClick}
                        >
                            Start chat
                        </Button>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Help Centre</p>
                        <p>
                            We have more than 90 articles in our
                            <span className="link border">Help Centre</span>
                            to help you to find answers.
                        </p>
                    </div>
                    <div className="settingsDetailWraper brdr-btm pb-2">
                        <p className="bold">Contact Us</p>
                        <p>
                            <span className="link border">Check out</span>
                            our available services.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Support;
