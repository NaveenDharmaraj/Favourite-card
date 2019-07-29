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
                    label={formatMessage('privacyOptions:privacyShareNameLabel')}
                    name="privacyShareName"
                    onChange={handleInputChange}
                />
                <br />
                <Form.Field
                    checked={privacyShareAmount}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareAmount"
                    label={formatMessage('privacyOptions:privacyShareAmountLabel')}
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
                            label={formatMessage('privacyOptions:privacyShareEmailLabel')}
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
                                label={formatMessage('privacyOptions:privacyShareAddressLabel')}
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
