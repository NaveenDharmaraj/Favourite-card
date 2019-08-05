import _ from 'lodash';
import React, {
    Fragment,
} from 'react';
import {
    Checkbox,
    Divider,
    Form,
    Header,
    Select,
} from 'semantic-ui-react';


const PrivacyOptions = (props) => {
    const {
        formatMessage,
        giveFrom,
        giveToType,
        privacyShareAddress,
        privacyShareAmount,
        privacyShareEmail,
        privacyShareName,
        handleInputChange,
        infoToShare,
        infoToShareList,
    } = props;
    let privacyShareAddressLabel = null;
    let privacyShareEmailLabel = null;
    let privacyShareNameLabel = null;
    const privacyEmail = formatMessage('privacyOptions:privacyDataEmail');
    const privacyPostal = formatMessage('privacyOptions:privacyDataPostal');
    const privacyShareAmountLabel = formatMessage(`privacyOptions:share${giveToType}PrivacyGiftAmount`);
    const myGiveFromType = (giveFrom.type !== 'user') ? formatMessage(`privacyOptions:my${giveFrom.type}`) : '';
    switch (giveFrom.type) {
        case 'user':
            privacyShareNameLabel = formatMessage(`privacyOptions:share${giveToType}UserName`);
            privacyShareEmailLabel = formatMessage(`privacyOptions:share${giveToType}PrivacyPostal`, { privacyData: privacyEmail });
            privacyShareAddressLabel = formatMessage(`privacyOptions:share${giveToType}PrivacyPostal`, { privacyData: privacyPostal });
            break;
        case 'companies':
            privacyShareNameLabel = formatMessage(`privacyOptions:share${giveToType}PrivacyName`, { giveFrom: myGiveFromType });
            break;
        case 'groups':
            privacyShareNameLabel = formatMessage(`privacyOptions:share${giveToType}PrivacyName`, { giveFrom: myGiveFromType });
            break;
        case 'campaigns':
            privacyShareNameLabel = formatMessage(`privacyOptions:share${giveToType}PrivacyName`, { giveFrom: myGiveFromType });
            break;
        default: break;
    }
    return (
        <Fragment>
            <Form.Field>
                <Divider className="dividerMargin" />
            </Form.Field>
            <Form.Field>
                <Header as="h3">{formatMessage('privacyOptions:privacyOptionsLabel')}</Header>
            </Form.Field>
            <Form.Field>
                <label
                    className="privacy-header"
                    htmlFor="privacyShareName"
                >
                    {formatMessage(`privacyOptions:forGiving${giveToType}Label`)}
                </label>
                <br />
                <Form.Field
                    checked={privacyShareName}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareName"
                    label={privacyShareNameLabel}
                    name="privacyShareName"
                    onChange={handleInputChange}
                />
                <br />
                <Form.Field
                    checked={privacyShareAmount}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareAmount"
                    label={privacyShareAmountLabel}
                    name="privacyShareAmount"
                    onChange={handleInputChange}
                />
            </Form.Field>
            {(giveFrom.type === 'user') && (

                <Fragment>
                    <Form.Field>
                        <label
                            className="privacy-header"
                            htmlFor="privacyShareEmail"
                        >
                            {
                                formatMessage(`privacyOptions:forGiving${giveToType}OrganizersLabel`)
                            }
                        </label>
                        <br />
                        <Form.Field
                            checked={privacyShareEmail}
                            className="ui checkbox checkbox-text"
                            control={Checkbox}
                            id="privacyShareEmail"
                            label={privacyShareEmailLabel}
                            name="privacyShareEmail"
                            onChange={handleInputChange}
                        />
                        <br />
                        {/* {true && ( */}
                        { !_.isEmpty(infoToShareList) && infoToShareList.length > 0 && (
                            <Form.Field
                                checked={privacyShareAddress}
                                className="ui checkbox checkbox-text"
                                control={Checkbox}
                                id="privacyShareAddress"
                                label={privacyShareAddressLabel}
                                name="privacyShareAddress"
                                onChange={handleInputChange}
                            />
                        )}
                    </Form.Field>
                    {
                        !_.isEmpty(infoToShareList) && !!privacyShareAddress && (
                            <Form.Field>
                                <label htmlFor="infoToShare">
                                    {formatMessage('privacyOptions:selectNameAndAddressLabel')}
                                </label>
                                <Form.Field
                                    control={Select}
                                    id="infoToShare"
                                    name="infoToShare"
                                    options={infoToShareList}
                                    onChange={handleInputChange}
                                    value={infoToShare.value}
                                />
                            </Form.Field>
                        )
                    }
                </Fragment>
            )
            }
        </Fragment>
    );
};

export default PrivacyOptions;
