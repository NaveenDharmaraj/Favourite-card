import React from 'react';
import {
    Button,
} from 'semantic-ui-react';

import MyCauses from './causes';
import MyTags from './tags';

// eslint-disable-next-line react/prefer-stateless-function
class EditCharitableInterest extends React.Component {
    render() {
        return (
            <div>
                <MyCauses />
                <MyTags />
                <div className="pt-2">
                    <Button className="blue-btn-rounded-def w-140">Save</Button>
                </div>
            </div>
        );
    }
}

export default EditCharitableInterest;
