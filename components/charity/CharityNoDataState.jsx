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
        beneficiaryFinanceApiFail,
        t: formatMessage,
    } = props;
    return (
        <Table basic className="ch_profileNodata" data-test="Charity_CharityNoDataState_noData">
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
                                        {beneficiaryFinanceApiFail ? formatMessage('charityProfile:charityProfileChartApiFail')
                                            : formatMessage('charityProfile:noDataContent')
                                        }
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
    beneficiaryFinanceApiFail: false,
    t: () => { },
};

CharityNoDataState.propTypes = {
    beneficiaryFinanceApiFail: PropTypes.bool,
    t: PropTypes.func,
};

const connectedComponent = withTranslation('charityProfile')(CharityNoDataState);
export {
    connectedComponent as default,
    CharityNoDataState,
};
