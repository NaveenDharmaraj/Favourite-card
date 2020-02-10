import React from 'react';
import {
    Card,
    Image,
    Header,
    Button,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';

import noDataImg from '../../../static/images/noresults.png';

const NoDataState = ({
    noDataImage, contentData, subHeaderData, manageButton, btnLink, btnText,
}) => (
    <Card fluid className="noDataCard rightImg">
        <Card.Content>
            <Image
                floated="right"
                src={noDataImage}
            />
            <Card.Header className="font-s-14">
                <Header as="h4">
                    <Header.Content>
                        {contentData}
                        <Header.Subheader>
                            {subHeaderData}
                        </Header.Subheader>
                        {manageButton
                            && (
                                <a href={btnLink}>
                                    <Button
                                        className="success-btn-rounded-def mt-1"
                                        content={btnText}
                                    />
                                </a>
                            )}
                    </Header.Content>
                </Header>
            </Card.Header>
        </Card.Content>
    </Card>
);

NoDataState.defaultProps = {
    btnLink: '/dashboard',
    btnText: 'Submit',
    contentData: 'No transactions yet',
    manageButton: false,
    noDataImage: noDataImg,
    subHeaderData: '',
};

NoDataState.propTypes = {
    btnLink: PropTypes.string,
    btnText: PropTypes.string,
    contentData: PropTypes.string,
    manageButton: PropTypes.bool,
    noDataImage: PropTypes.string,
    subHeaderData: PropTypes.string,

};
export default NoDataState;
