import React, { Fragment } from 'react';
import {
    Image, Placeholder,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';


const ChatInboxLoader = ({ count }) => {
    const renderChatLoader = () => {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(
                <div style={{
                    alignItems: 'start',
                    display: 'flex',
                }}
                >
                    <Placeholder
                        as={Image}
                        circular
                        style={{
                            height: 65,
                            marginBottom: 10,
                            marginTop: 10,
                            width: 65,
                        }}
                    >
                        <Placeholder.Image />
                    </Placeholder>
                    <Placeholder
                        style={{
                            marginLeft: 20,
                            width: '20vh',
                        }}
                    >
                        <Placeholder.Header>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                </div>,
            );
        }
        return arr;
    };
    return (
        <Fragment>
            {renderChatLoader()}
        </Fragment>
    );
};

ChatInboxLoader.defaultProps = {
    count: 3,
};

ChatInboxLoader.propTypes = {
    count: PropTypes.number,
};

export default ChatInboxLoader;
