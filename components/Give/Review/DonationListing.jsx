
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
    bool,
    func,
    PropTypes,
    string,
} from 'prop-types';
import _ from 'lodash';

import { Link } from '../../../routes';

const DonationListing = ({
    disableButton,
    formatMessage,
    handleSubmit,
    noteData,
    startsOn,
    tacReceipt,
}) => {
    const {
        attributes,
    } = tacReceipt;
    let buttonText = formatMessage('donationsAddMoney');
    let refundMessage = formatMessage('commonNonrefundable');
    if (startsOn) {
        buttonText = formatMessage('donationsScheduleMonthlyTransaction');
        refundMessage = formatMessage('commonRecurringNonrefundable');
    }
    return (
        <Fragment>
            <List divided relaxed size="large" className="reviewList">
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
                                                <Link className="lnkChange" route="/donations/tax-receipt-profile">
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
                {
                    !!startsOn && (
                        <List.Item>
                            <List.Content>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                                            <List.Header>{formatMessage('giveCommon:startsOn')}</List.Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <div className="reviewList-description">
                                                <div className="list-desc-head">{startsOn || formatMessage('giveCommon:emptyMessage')}</div>
                                                <div>
                                                    {formatMessage('donationStartsOnMessage')}
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Content>
                        </List.Item>
                    )
                }
                {
                    !!noteData && (
                        <List.Item>
                            <List.Content>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                                            <List.Header>{formatMessage('noteToSelfLabel')}</List.Header>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <div className="reviewList-description">
                                                <div>
                                                    {noteData || formatMessage('giveCommon:emptyMessage')}
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Content>
                        </List.Item>
                    )
                }
            </List>
            <Divider />
            <Divider hidden />
            <Container textAlign="center">
                <Button
                    primary
                    className="btnReview blue-btn-rounded"
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
                                <Link route="/donations/new">
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

DonationListing.defaultProps = {
    disableButton: false,
    formatMessage: _.noop,
    handleSubmit: _.noop,
    noteData: '',
    startsOn: '',
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
};

DonationListing.propTypes = {
    disableButton: bool,
    formatMessage: func,
    handleSubmit: func,
    noteData: string,
    startsOn: string,
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
};
export default DonationListing;
