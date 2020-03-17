import React from 'react';
import {
    Grid, Header, Button, Icon,
} from 'semantic-ui-react';

// eslint-disable-next-line react/prefer-stateless-function
class ChatHeader extends React.Component {

    render() {
        const {
            compose,
            composeNew,
            isSmallerScreen,
            smallerScreenSection,
            handleChatHeaderBackButton,
        } = this.props;
        return (
            <div className="messageHeader">
                <Grid verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column mobile={8} tablet={12} computer={13}>
                            <div className="pt-1 pb-1">
                                <Header as="h2">
                                    {(isSmallerScreen && !compose && smallerScreenSection === 'convList') && (
                                        <Button
                                            className="back-btn-messages"
                                            onClick={() => handleChatHeaderBackButton()}
                                            style={{ float: 'left' }}
                                        >
                                            <Icon name="chevron left" />
                                        </Button>
                                    )}
                                    Messages
                                </Header>
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={4} computer={3} className="text-right">
                            <div className="pb-1 compose-btn-wrapper">
                                <Button
                                    className={`${compose ? ' red-btn-rounded-def red' : 'success-btn-rounded-def'}`}
                                    onClick={() => composeNew()}
                                >
                                    <Icon name={compose ? 'close icon' : 'edit icon'} />
                                    {isSmallerScreen  ? '' : (compose ? 'Cancel' : 'Compose')}
                                </Button>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
export default ChatHeader;
