/* eslint-disable no-else-return */
import React, {
    Fragment,
} from 'react';
import {
    Container,
    Divider,
    Form,
    Header,
    Icon,
    Popup,
    Select,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import { Link } from '../../routes';
import CharityFrequency from '../Give/DonationFrequency';

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
        slug,
        giveData,
        language,
        handlegiftTypeButtonClick,
    } = props;
    let repeatGift = null;

    

    const renderPaymentTaxErrorMsg = () => {
        if ((userAccountsFetched && giveFrom.type === 'user') || (companyAccountsFetched && giveFrom.type === 'companies')) {
            const taxProfile = (giveFrom.type === 'companies' && companyDetails && companyDetails.companyDefaultTaxReceiptProfile)
                ? companyDetails.companyDefaultTaxReceiptProfile
                : defaultTaxReceiptProfile;
            if (_isEmpty(paymentInstrumentList) && _isEmpty(taxProfile)) {
                const paymentLink = (giveFrom.type === 'companies')
                    ? <a href={`/companies/${slug}/payment-profiles`}>payment method</a>
                    : <Link route='/user/profile/settings/creditcard'>payment method</Link>;
                const taxLink = (giveFrom.type === 'companies')
                    ? <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                    : <Link route='/user/tax-receipts'>tax receipt recipient</Link>
                return (
                    <div className="mb-1">
                        <Icon color="red" name="warning circle" />
                        <span style={{ color: 'red' }}>
                            To send a monthly gift, first add a {paymentLink} and {taxLink} to your account details. We won't charge your card without your permission.
                        </span>
                    </div>
                );
            } else if (_isEmpty(paymentInstrumentList)) {
                const link = (giveFrom.type === 'companies')
                    ? <a href={`/companies/${slug}/payment-profiles`}>payment method</a>
                    : <Link route='/user/profile/settings/creditcard'>payment method</Link>
                return (
                    <div className="mb-1">
                        <Icon color="red" name="warning circle" />
                        <span style={{ color: 'red' }}>
                            To send a monthly gift, first add a {link} to your account details. We won't charge your card without your permission.
                        </span>
                    </div>
                );
            } else if (_isEmpty(taxProfile)) {
                const link = (giveFrom.type === 'companies')
                    ? <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                    : <Link route="/user/tax-receipts">tax receipt recipient</Link>
                return (
                    <div className="mb-1">
                        <Icon color="red" name="warning circle" />
                        <span style={{ color: 'red' }}>
                            To send a monthly gift, first add a {link} to your account details.
                        </span>
                    </div>
                );
            }
        }
        return null;
    };
    if (giveFrom.type === 'user' || giveFrom.type === 'companies') {
        repeatGift = (
            <Fragment>
                <CharityFrequency
                    isGiveFlow={true}
                    formatMessage={formatMessage}
                    giftType={giftType}
                    handlegiftTypeButtonClick={handlegiftTypeButtonClick}
                    handleInputChange={handleInputChange}
                    language={language}
                />
            </Fragment>
        );
    }

    return (
        <Fragment>
            {repeatGift}
            <Form.Field className="give_flow_field">
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
                    className="dropdownWithArrowParent icon"
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
