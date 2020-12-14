/* eslint-disable operator-assignment */
import React from 'react';

import {
    Button,
    Header,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

function SingleCause(props) {
    let {
        cause,
        index,
        parentHandleCauses,
        userCauses,
    } = props;

    const {
        attributes: {
            display_name,
            name,
        },
    } = cause;
    return (
        <Button
            basic
            fluid
            className={`select-btn  ${_.includes(userCauses, name) ? 'active' : ''}`}
            id={name}
            name={name}
            onClick={parentHandleCauses}
        >
            {display_name}
        </Button>
    );
}

export default SingleCause;
