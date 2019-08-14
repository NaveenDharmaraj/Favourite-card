
import React, {
    Fragment,
} from 'react';
import {
    List,
    Grid,
    Image,
    Divider,
    Container,
    Button,
} from 'semantic-ui-react';
import {
    arrayOf,
    bool,
    element,
    func,
    oneOfType,
    PropTypes,
    string,
} from 'prop-types';
import _ from 'lodash';

import { Link } from '../../../routes';

const RenderList = ({
    displayData,
    label,
}) => (
    <List.Item>
        <List.Content>
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                        <List.Header>{label}</List.Header>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <div className="reviewList-description">
                            <div>
                                {
                                    (_.isArray(displayData)
                                        && displayData.map((toLt, i) => (
                                            <div>
                                                {
                                                    toLt.split('\n').map((item) => (
                                                        <span key={i}>
                                                            {item}
                                                            <br />
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    )
                                }
                                {
                                    (!_.isArray(displayData)
                                        && displayData
                                    )
                                }
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </List.Content>
    </List.Item>
);

RenderList.defaultProps = {
    displayData: '',
    label: '',
};

RenderList.propTypes = {
    displayData: oneOfType([
        arrayOf(element),
        string,
    ]),
    label: string,
};

const AllocationListing = ({
    disableButton,
    formatMessage,
    handleSubmit,
    data,
    tacReceipt,
    giveData,
    type,
    toURL,
}) => {
    const {
        attributes,
    } = tacReceipt;
    const {
        startsOn,
        totalAmount,
        matchList,
        fromList,
        toList,
        coverFessText,
        givingGroupMessage,
        givingOrganizerMessage,
        groupMatchedBy,
        showTaxOnRecurring,
    } = data;

    const {
        giveTo: {
            isCampaign,
        },
        noteToCharity,
        noteToRecipients,
        noteToSelf,
    } = giveData;
    const giveToType = (isCampaign) ? 'Campaign' : 'Group';
    const isGroup = type === 'give/to/group';
    const isUser = giveData.giveFrom.type === 'user';
    const emptyMessage = formatMessage('giveCommon:emptyMessage');
    let buttonText = formatMessage('allocationGiveMoney');
    let refundMessage = formatMessage('commonNonrefundable');
    if (startsOn) {
        buttonText = formatMessage('allocationRecurringGiveMoney');
        refundMessage = formatMessage('commonRecurringNonrefundable');
    }
    return (
        <Fragment>
            <List divided relaxed size="large" className="reviewList">
                {
                    (!_.isEmpty(tacReceipt)
                    && (!!giveData.donationAmount || !!showTaxOnRecurring)) && (
                        <List.Item>
                            <List.Content>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                                            <Image verticalAlign="middle" src="../../../../static/images/note.svg" className="imgTax" />
                                            <List.Header>{formatMessage('taxReceiptRecipientLabel')}</List.Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <div className="reviewList-description">
                                                <div className="list-desc-head">{attributes.fullName}</div>
                                                <div>
                                                    {attributes.addressOne}
                                                    { (attributes.addressTwo) ? `, ${attributes.addressTwo}` : ``}
                                                </div>
                                                <div>
                                                    {attributes.city}
                                                    {`, ${attributes.province} ${attributes.postalCode}`}
                                                </div>
                                                { !disableButton
                                                    && (
                                                        <Link className="lnkChange" route={`/${type}/tax-receipt-profile`}>
                                                            {formatMessage('giveCommon:change')}
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Content>
                        </List.Item>
                    )
                }
                <RenderList
                    label={formatMessage('allocationAmountLabel')}
                    displayData={totalAmount || emptyMessage}
                />
                {
                    !!coverFessText && (
                        <RenderList
                            label={formatMessage('coverFeesLabel')}
                            displayData={coverFessText || emptyMessage}
                        />
                    )
                }
                {
                    !!startsOn && (
                        <RenderList
                            label={formatMessage('giveCommon:startsOn')}
                            displayData={startsOn || emptyMessage}
                        />
                    )
                }
                <RenderList
                    label={formatMessage('commonFrom')}
                    displayData={fromList || emptyMessage}
                />
                {
                    !!matchList && (
                        <RenderList
                            label={formatMessage('matchedByLabel')}
                            displayData={matchList || emptyMessage}
                        />
                    )
                }
                {
                    !!groupMatchedBy && (
                        <RenderList
                            label={formatMessage('giftToGroupMatchedBy')}
                            displayData={groupMatchedBy || emptyMessage}
                        />
                    )
                }
                <RenderList
                    label={formatMessage('commonTo')}
                    displayData={toList || emptyMessage}
                />
                {
                    !!noteToCharity && (
                        <RenderList
                            label={formatMessage('messageToReceipientLabel')}
                            displayData={noteToCharity || emptyMessage}
                        />
                    )
                }
                {
                    !!noteToRecipients && (
                        <RenderList
                            label={formatMessage('messageToRecipientsLabel')}
                            displayData={noteToRecipients || emptyMessage}
                        />
                    )
                }
                {
                    !!isGroup && (
                        <RenderList
                            label={formatMessage(`privacyShareGiving${giveToType}Label`)}
                            displayData={givingGroupMessage || emptyMessage}
                        />
                    )
                }
                {
                    !!isGroup && isUser && (
                        <RenderList
                            label={formatMessage(`privacyShareOrganizers${giveToType}Label`)}
                            displayData={givingOrganizerMessage || emptyMessage}
                        />
                    )
                }
                {
                    !!noteToSelf && (
                        <RenderList
                            label={formatMessage('noteToSelfLabel')}
                            displayData={noteToSelf || emptyMessage}
                        />
                    )
                }
            </List>
            <Divider />
            <Divider hidden />
            <Container textAlign="center">
                <Button
                    primary
                    className="blue-btn-rounded"
                    content={(!disableButton)
                        ? buttonText
                        : formatMessage('giveCommon:submitingButton')}
                    disabled={(disableButton)}
                    onClick={handleSubmit}
                />
                <Divider hidden />
                { !disableButton
                    && (
                        <Fragment>
                            <p className="paragraph">
                                {formatMessage('giveCommon:commonOr')}
                                <Link route={toURL}>
                                    {formatMessage('giveCommon:commonMakeChanges')}
                                </Link>
                            </p>
                            <p className="paragraph">
                                {refundMessage}
                            </p>
                        </Fragment>
                    )
                }
            </Container>
        </Fragment>
    );
};

AllocationListing.defaultProps = {
    data: {
        coverFessText: '',
        fromList: [],
        givingGroupMessage: '',
        givingOrganizerMessage: '',
        groupMatchedBy: '',
        matchList: '',
        showTaxOnRecurring: '',
        startsOn: '',
        toList: [],
        totalAmount: '',
    },
    disableButton: false,
    formatMessage: _.noop,
    giveData: {
        donationAmount: '',
        giveFrom: {
            type: '',
        },
        giveTo: {
            isCampaign: false,
        },
        noteToCharity: '',
        noteToRecipients: '',
        noteToSelf: '',
    },
    handleSubmit: _.noop,
    tacReceipt: {
        attributes: {
            addressOne: '',
            addressTwo: '',
            city: '',
            fullName: '',
            postalCode: '',
            province: '',
        },
    },
    toURL: '',
    type: '',
};

AllocationListing.propTypes = {
    data: PropTypes.shape({
        coverFessText: string,
        fromList: arrayOf(PropTypes.element),
        givingGroupMessage: string,
        givingOrganizerMessage: string,
        groupMatchedBy: string,
        matchList: string,
        showTaxOnRecurring: string,
        startsOn: string,
        toList: arrayOf(PropTypes.element),
        totalAmount: string,
    }),
    disableButton: bool,
    formatMessage: func,
    giveData: PropTypes.shape({
        donationAmount: string,
        giveFrom: PropTypes.shape({
            type: string,
        }),
        giveTo: PropTypes.shape({
            isCampaign: bool,
        }),
        noteToCharity: string,
        noteToRecipients: string,
        noteToSelf: string,
    }),
    handleSubmit: func,
    tacReceipt: PropTypes.shape({
        attributes: PropTypes.shape({
            addressOne: string.isRequired,
            addressTwo: string,
            city: string.isRequired,
            fullName: string.isRequired,
            postalCode: string.isRequired,
            province: string.isRequired,
        }).isRequired,
    }),
    toURL: string,
    type: string,
};

export default AllocationListing;
