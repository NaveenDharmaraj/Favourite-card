import _noop from 'lodash/noop';
import {
    arrayOf,
    bool,
    func,
    node,
    oneOf,
} from 'prop-types';
import React, {
    Component,
} from 'react';
import {
    Icon,
    Message,
} from 'semantic-ui-react';


const iconMap = {
    error: 'exclamation',
    info: 'info',
    success: 'check',
    warning: 'exclamation',
};
const types = Object.keys(iconMap);

class StatusMessage extends Component {
    constructor(props) {
        super(props);

        const {
            hidden,
        } = props;

        this.state = {
            hidden,
        };

        const handleDismiss = (...args) => {
            this.setState({ hidden: true });
            props.handleDismiss(...args);
        };

        this.handleDismiss = handleDismiss.bind(this);
    }

    render() {
        const {
            props: {
                compact,
                heading,
                items,
                message,
                type,
            },
            state: {
                hidden,
            },
        } = this;
        const hasList = !!items.length;
        const props = {
            className: 'status-message',
            compact,
            onDismiss: this.handleDismiss,
            [type]: true,
        };
        if (hasList) {
            props.className += ' left';
        }

        return (
            <div
                className="status-message-container"
                hidden={hidden}
            >
                {/* force Message to sit on its own row */}
                <Message
                    {...props} icon className="chimp-center-msg"
                >
                    <Icon
                        className="status-icon"
                        name={`${iconMap[type]} circle`}
                    />
                    <Message.Content>
                        <Message.Header>
                            {typeof heading === 'string'
                                ? (<span>{heading}</span>)
                                : heading
                            }
                        </Message.Header>
                        {hasList && (
                            <Message.List
                                items={items}
                            />
                        )}
                        {!!message && (
                            <Message.Content
                                content={message}
                            />
                        )}
                    </Message.Content>
                </Message>
            </div>
        );
    }
}
StatusMessage.defaultProps = {
    compact: true,
    handleDismiss: _noop,
    hidden: false,
    items: [],
    type: 'info',
};
StatusMessage.propTypes = {
    compact: bool,
    handleDismiss: func,
    heading: node.isRequired,
    hidden: bool,
    items: arrayOf(node),
    message: node, // eslint-disable-line react/require-default-props
    type: oneOf(types),
};

export {
    StatusMessage as default,
    types,
};
