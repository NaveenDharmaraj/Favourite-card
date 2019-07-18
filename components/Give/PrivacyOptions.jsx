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
    console.log('privacy options props');
    console.log(props);
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
                    {formatMessage(`forGiving${giveToType}Label`)}
                </label>
                <br />
                <Form.Field
                    checked={privacyShareName}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareName"
                    label="Share my name with the Giving Group I’m giving to" // {privacyShareNameLabel}
                    name="privacyShareName"
                    onChange={handleInputChange}
                />
                <br />
                <Form.Field
                    checked={privacyShareAmount}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareAmount"
                    label="Share my gift amount with Giving Group I’m giving to" // {privacyShareAmountLabel}
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
                                formatMessage(`forGiving${giveToType}OrganizersLabel`)
                            }
                        </label>
                        <br />
                        <Form.Field
                            checked={privacyShareEmail}
                            className="ui checkbox checkbox-text"
                            control={Checkbox}
                            id="privacyShareEmail"
                            label="Share my email address with the Giving Group organizers" // {privacyShareEmailLabel}
                            name="privacyShareEmail"
                            onChange={handleInputChange}
                        />
                        <br />
                        {/* { !_.isEmpty(infoToShareList) && infoToShareList.length > 0 && */}
                        {true && (
                            <Form.Field
                                checked={privacyShareAddress}
                                className="ui checkbox checkbox-text"
                                control={Checkbox}
                                id="privacyShareAddress"
                                label="Share my postal address with the Giving Group organizers" // {privacyShareAddressLabel}
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
