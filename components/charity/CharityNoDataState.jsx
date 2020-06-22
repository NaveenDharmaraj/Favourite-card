import React from 'react';
import {
    Card,
    Image,
    Header,
    Table,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';

import { withTranslation } from '../../i18n';
import noDataImg from '../../static/images/noresults.png';

const CharityNoDataState = (props) => {
    const {
        t: formatMessage,
    } = props;
    return (
        <Table basic className="ch_profileNodata" data-test="CharityNoDataState_no_data_table">
            <Table.Body>
                <Card fluid className="noData rightImg noHeader">
                    <Card.Content>
                        <Image
                            floated="right"
                            src={noDataImg}
                        />
                        <Card.Header className="font-s-14">
                            <Header as="h4">
                                {formatMessage('charityProfile:noDataHeader')}
                                <Header.Subheader>
                                    <Header.Content>
                                        {formatMessage('charityProfile:noDataContent')}
                                    </Header.Content>
                                </Header.Subheader>
                            </Header>
                        </Card.Header>
                    </Card.Content>
                </Card>
            </Table.Body>
        </Table>
    );
};

CharityNoDataState.defaultProps = {
    t: () => {},
};

CharityNoDataState.propTypes = {
    t: PropTypes.func,
};

const connectedComponent = withTranslation('charityProfile')(CharityNoDataState);
export {
    connectedComponent as default,
    CharityNoDataState,
};
