/* eslint-disable no-else-return */
import React, {
    Fragment,
} from 'react';
import {
    Divider,
    Form,
    Header,
    Icon,
    Popup,
    Select,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import { Link } from '../../routes';

const SpecialInstruction = (props) => {
    const {
        formatMessage,
        giftType,
        giftTypeList,
        giveFrom,
        handleInputChange,
        infoToShare,
        infoToShareList,
        paymentInstrumentList,
        defaultTaxReceiptProfile,
        companyDetails,
        companyAccountsFetched,
        userAccountsFetched,
        slug
    } = props;
    let repeatGift = null;
    const renderPaymentTaxErrorMsg = () => {
        if ((userAccountsFetched && giveFrom.type === 'user') || (companyAccountsFetched && giveFrom.type === 'companies')) {
            const taxProfile = (giveFrom.type === 'companies' && companyDetails && companyDetails.companyDefaultTaxReceiptProfile)
                ? companyDetails.companyDefaultTaxReceiptProfile
                : defaultTaxReceiptProfile;
            if (_isEmpty(paymentInstrumentList) && _isEmpty(taxProfile)) {
                return (
                    <div>
                               To send a monthly gift, first add a &nbsp;
                        {
                            giveFrom.type === 'companies'
                                ? <a href={`/companies/${slug}/payment-profiles`}>payment method </a>
                                : <Link route = '/user/profile/settings/creditcard'>payment method</Link>
                        }
                              &nbsp; and&nbsp;
                        {
                            giveFrom.type === 'companies'
                                ? <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                                : <Link route = '/user/tax-receipts'>tax receipt recipient</Link>
                        }
                              &nbsp; to your account details.We won't charge your card without your permission.
                    </div>
                );
            } else if (_isEmpty(paymentInstrumentList)) {
                return (
                    <div>
                                 To send a monthly gift, first add a &nbsp;
                        {
                            giveFrom.type === 'companies'
                                ? <a href={`/companies/${slug}/payment-profiles`}>payment method </a>
                                : <Link route = '/user/profile/settings/creditcard'>payment method</Link>
                        }
                              &nbsp;   to your account details.We won't charge your card without your permission.
                    </div>
                );
            } else if ( _isEmpty(taxProfile)) {
                return (
                    <div>
                            To send a monthly gift, first add a &nbsp;
                        {
                            giveFrom.type === 'companies'
                                ? <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                                : <Link route="/user/tax-receipts">tax receipt recipient</Link>
                        }
                           &nbsp; to your account details.
                    </div>
                );
            }
        }
        return null;
    };
    if (giveFrom.type === 'user' || giveFrom.type === 'companies') {
        repeatGift = (
            <Fragment>
                <Form.Field>
                    <label htmlFor="giftType">
                        {formatMessage('specialInstruction:repeatThisGiftLabel')}
                    </label>
                    <Form.Field
                        control={Select}
                        id="giftType"
                        name="giftType"
                        options={giftTypeList}
                        onChange={handleInputChange}
                        value={giftType.value}
                    />
                </Form.Field>
                {giftType.value > 0 && renderPaymentTaxErrorMsg()}
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Form.Field>
                <Divider className="dividerMargin" />
            </Form.Field>
            <Form.Field>
                <Header as="h3" className="f-weight-n">{formatMessage('specialInstruction:specialInstructionLabel')}</Header>
            </Form.Field>
            {repeatGift}

            <Form.Field>
                <label htmlFor="infoToShare">
                    {formatMessage('specialInstruction:infoToShareLabel')}
                </label>
                <Popup
                    content={formatMessage('specialInstruction:infotoSharePopup')}
                    position="top center"
                    trigger={(
                        <Icon
                            color="blue"
                            name="question circle"
                            size="large"
                        />
                    )}
                />
                <Form.Field
                    control={Select}
                    id="infoToShare"
                    name="infoToShare"
                    options={infoToShareList}
                    onChange={handleInputChange}
                    value={infoToShare.value}
                />
            </Form.Field>
        </Fragment>
    );
};
SpecialInstruction.defaultProps = {
    giftType: {
        value: null,
    },
    infoToShare: {
        value: null,
    },
};
export default SpecialInstruction;
