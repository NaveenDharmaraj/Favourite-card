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
import getConfig from 'next/config';

import { dismissUxCritialErrors } from '../../actions/error';

const iconMap = {
    error: 'exclamation',
    info: 'info',
    success: 'check',
    warning: 'exclamation',
};
const types = Object.keys(iconMap);
let timer = null;
const { publicRuntimeConfig } = getConfig();
const {
    TOAST_MESSAGE_TIMEOUT,
} = publicRuntimeConfig;

class StatusMessage extends Component {
    constructor(props) {
        super(props);
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    componentDidMount() {
        timer = setTimeout(() => {
            this.handleDismiss();
        }, TOAST_MESSAGE_TIMEOUT);
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    handleDismiss() {
        dismissUxCritialErrors(this.props.error, this.props.dispatch);
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
        } = this;
        const hasList = !!items.length;
        const props = {
            className: 'status-message',
            compact,
            [type]: true,
        };
        if (hasList) {
            props.className += ' left';
        }
        return (
            <div
                className="status-message-container"
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
