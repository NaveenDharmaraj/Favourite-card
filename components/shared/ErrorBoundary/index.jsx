import React, {
    Component,
} from 'react';
import { // eslint-disable-line import/order
    Image,
    Segment,
} from 'semantic-ui-react';

import errorImage from '../../../static/images/chimp-bricked.png';

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

    componentDidCatch() {
        this.setState({ hasError: true });
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
                >
                    <Image
                        centered
                        src={errorImage}
                    />
                </Segment>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
