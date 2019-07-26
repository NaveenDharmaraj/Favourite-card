/* eslint-disable operator-assignment */
import React from 'react';

import {
    Button,
    Header,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

function CauseComponent(props) {
    let {
        cause,
        parentHandleCauses,
        userCauses,
    } = props;
    return (
        <Grid.Column mobile={16} tablet={8} computer={4}>
            <Button
                basic
                fluid
                className={`select-btn ${_.includes(userCauses, cause) ? 'active' : ''}`}
                id={cause}
                name="arts_and_culture"
                onClick={parentHandleCauses}
            >
                {cause}
            </Button>
        </Grid.Column>
    )
}

export default CauseComponent;
