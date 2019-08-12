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
        <Grid.Column mobile={16} tablet={8} computer={4}>
            <Button
                basic
                fluid
                className={`select-btn color_${index} ${_.includes(userCauses, name) ? 'active' : ''}`}
                id={name}
                name={name}
                onClick={parentHandleCauses}
            >
                {display_name}
            </Button>
        </Grid.Column>
    );
}

export default SingleCause;
