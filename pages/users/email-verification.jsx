import React, {
    Fragment,
} from 'react';
import { // eslint-disable-line import/order
    Button,
    Container,
    Grid,
    Header,
    Image,
    Segment,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

// import ChatLive from 'client/common/components/ChatLive';
import StatusMessage from '../../components/shared/StatusMessage';
// import connectBranch from 'client/common/store/connectBranch';
import auth0, {
    activateUserEmail,
    resendVerificationEmail,
} from '../../services/auth';
import Layout from '../../components/shared/Layout';

class EmailVerificationView extends React.Component {
    constructor(props) {
        super(props);
        this.auth0UserEmail = (!_isEmpty(props.auth) && !_isEmpty(props.auth.auth0UserEmail))
            ? props.auth.auth0UserEmail : auth0.userEmail;
        this.resendEmail = (!_isEmpty(props.auth) && !_isEmpty(props.auth.resendEmail))
            ? props.auth.resendEmail : auth0.resendEmail;
        this.auth0UserId = (!_isEmpty(props.auth) && !_isEmpty(props.auth.auth0UserId))
            ? props.auth.auth0UserId : auth0.auth0UserId;
    }

    render() {
        // const colProps = {
        //     computer: 5,
        //     largeScreen: 5,
        //     mobile: 16,
        //     tablet: 5,
        //     widescreen: 5,
        // };
        // const {
        //     enableDevFeature,
        // } = getState('/config');
        const iconClassName = 'email-icon';
        const headingText = (<Header as="h2">Check your email</Header>);
        const copyText = (
            <Fragment>
                <p>
                    We sent instructions for verifying your email address
                    <wbr />
                    to
                    <b>
                        {this.auth0UserEmail}
                        .
                    </b>
                </p>
                <p>
                    This helps us keep your CHIMP Account secure.
                </p>
                <p>
                    Don't see the email from us?&nbsp;
                    {/* UX ask for a link instead of button here */
                    }
                    <a
                        href={`/api/users/verification/resend?user_id=${this.auth0UserId}`}
                        onClick={resendVerificationEmail}
                    >
                        Resend email.
                    </a>
                </p>
            </Fragment>
        );
        let devModeText = null;
        if (true) {
            devModeText = (
                <Segment
                    color="blue"
                    raised
                >
                    <Header.Subheader as="h5">Development Mode - Instant Activation</Header.Subheader>
                    <p>
                        Because you&#39;re in development mode, we&#39;ll show you
                        <wbr />
                        the activation link right here. It&#39;s less of a pain this
                        <wbr />
                        way. That, and we love you. ❤️
                    </p>
                    <Button
                        basic
                        color="blue"
                        content="Click To Activate"
                        onClick={activateUserEmail}
                    />
                </Segment>
            );
        }
        return (
            <Layout>
                <Container
                    className="app-status-messages"
                >
                    {this.resendEmail
                        && (
                            <StatusMessage
                                heading="Email sent."
                                message="We sent you another email with instructions for verifying your email address."
                                type="success"
                            />
                        )
                    }
                </Container>
                <div
                    className="email-content-container"
                >
                    <Image
                        centered
                        className={iconClassName}
                        //src={iconSrc}
                    />
                    <Grid
                        className="email-verification-content-container"
                        columns={1}
                        padded="horizontally"
                        stretched
                        textAlign="center"
                    >
                        <Grid.Row
                            verticalAlign="top"
                        >
                            <Grid.Column
                                // {...colProps}
                            >
                                {headingText}
                                {devModeText}
                                {copyText}
                            </Grid.Column>
                        </Grid.Row>
                        {/* <Grid.Row
                            verticalAlign="bottom"
                        >
                            <Grid.Column
                                {...colProps}
                            >
                                <ChatLive />
                            </Grid.Column>
                        </Grid.Row> */}
                    </Grid>
                </div>
            </Layout>
        );
    }
}


function mapStateToProps(state) {
    return {
        auth: state.auth.auth0Failure,
    };
}

export default connect(mapStateToProps)(EmailVerificationView);
