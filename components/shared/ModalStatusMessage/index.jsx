import React, { Fragment } from 'react';
import {
    Icon,
    Message,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

class ModalStatusMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    render() {
        const {
            visible,
        } = this.state;
        const {
            message,
            error,
        } = this.props;
        return (
            <Fragment>
                {
                    visible && (
                        <Fragment>
                            {!_isEmpty(error) ? (
                                <Message negative icon className="mdlMessage left" onDismiss={() => { this.setState({ visible: false }); }}>
                                    <Icon name="warning sign" />
                                    <Message.Content>
                                        <Message.Header>{error}</Message.Header>
                                    </Message.Content>
                                </Message>

                            ) : (
                                <Message positive icon className="mdlMessage left" onDismiss={() => { this.setState({ visible: false }); }}>
                                    <Icon name="check" />
                                    <Message.Content>
                                        <Message.Header>{message}</Message.Header>
                                    </Message.Content>
                                </Message>
                            )}
                        </Fragment>
                    )
                }
            </Fragment>
        );
    }
}

ModalStatusMessage.propTypes = {
    error: PropTypes.string,
    message: PropTypes.string,
};

ModalStatusMessage.defaultProps = {
    error: '',
    message: 'Your profile have been saved successfully.',
};

export default ModalStatusMessage;
