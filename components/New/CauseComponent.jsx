/* eslint-disable operator-assignment */
import React from 'react';

import {
    Button,
    Header,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

function CauseComponent(props) {
    let {
        cause,
        parentHandleCauses,
        userCauses,
    } = props;
    function titleCase(str) {
        const splitStr = str.replace(/_/g, ' ').toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }
    const capStrng = titleCase(cause);

    return (
        <Grid.Column mobile={16} tablet={8} computer={4}>
            <Button
                basic
                fluid
                className={`select-btn ${_.includes(userCauses, cause) ? 'active' : ''}`}
                id={cause}
                name={cause}
                onClick={parentHandleCauses}
            >
                {capStrng}
            </Button>
        </Grid.Column>
    );
}

export default CauseComponent;
