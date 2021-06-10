import React from 'react';
import { Header } from 'semantic-ui-react';

import { generateBreadCrum } from '../../../helpers/createGrouputils';

const CreateGivingGroupHeader = ({ breakCrumArray, currentActiveStepCompleted, header }) => (
    <div className="createNewGrpheader">
        <Header as="h2">{header}</Header>
        {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
    </div>
);

CreateGivingGroupHeader.defaultProps = {
    breakCrumArray: [],
    currentActiveStepCompleted: [],
    header: 'Create a new Giving Group',
};
export default CreateGivingGroupHeader;
