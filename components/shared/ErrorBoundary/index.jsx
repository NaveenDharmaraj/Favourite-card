import React, {
    Component,
} from 'react';
import { // eslint-disable-line import/order
    Image,
    Segment,
    Grid,
    Header,
    Container,
    Button,
} from 'semantic-ui-react';
import errorImage from '../../../static/images/errorpage.png';
/**
 * This component MUST BE SIMPLE. It should have as little logic as possible because this is the
 * wall that stops the explosion cascade. An error thrown here will continue the cascade.
 * @see https://reactjs.org/docs/error-boundaries.html
 */
class ErrorBoundary extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        const {
            props: {
                children,
            },
            state: {
                hasError,
            },
        } = this;
        if (hasError) {
            return (
                <Segment
                    basic
                    className="errorPage"
                >
                    <Container>
                        <Grid stackable doubling>
                            <Grid.Row columns={2} verticalAlign="middle">
                                <Grid.Column>
                                    <div className="errorDesc">
                                        <Header as="h1">
                                            Oops, something went wrong
                                        </Header>
                                        <a href="https://www.charitableimpact.com">
                                            <Button className="success-btn-rounded-def">Go to home</Button>
                                        </a>
                                    </div>
                                </Grid.Column>
                                <Grid.Column verticalAlign="top">
                                    <Image
                                        centered
                                        src={errorImage}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>
            );
        }
        return children;
    }
}
export default ErrorBoundary;
