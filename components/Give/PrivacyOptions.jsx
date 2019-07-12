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
    } = props;

    return (
        <Fragment>
            <Form.Field>
                <Divider className="dividerMargin" />
            </Form.Field>
            <Form.Field>
                <Header as="h3">{formatMessage('privacyOptions:privacyOptionsLabel')}</Header>
                {/* <Header as="h3">Privacy options</Header> */}
            </Form.Field>
            <Form.Field>
                <label
                    className="privacy-header"
                    htmlFor="privacyShareName"
                >
                    {/* {formatMessage(messageList[`forGiving${giveToType}Label`])} */}
                    For Giving Group
                </label>
                <br />
                <Form.Field
                    checked="" // {privacyShareName}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareName"
                    label="" // {privacyShareNameLabel}
                    name="privacyShareName"
                    onChange="" // {handleInputChange}
                />
                <br />
                <Form.Field
                    checked="" // {privacyShareAmount}
                    className="ui checkbox checkbox-text"
                    control={Checkbox}
                    id="privacyShareAmount"
                    label="" // {privacyShareAmountLabel}
                    name="privacyShareAmount"
                    onChange="" // {handleInputChange}
                />
            </Form.Field>
            {
                true && (// (giveFrom.type === 'user') && (
                    <Fragment>
                        <Form.Field>
                            <label
                                className="privacy-header"
                                htmlFor="privacyShareEmail"
                            >
                                {
                                    // formatMessage(
                                    //     messageList[`forGiving${giveToType}OrganizersLabel`],
                                    // )
                                    'For Giving Campaign organizers'
                                }
                            </label>
                            <br />
                            <Form.Field
                                checked="" // {privacyShareEmail}
                                className="ui checkbox checkbox-text"
                                control={Checkbox}
                                id="privacyShareEmail"
                                label="" // {privacyShareEmailLabel}
                                name="privacyShareEmail"
                                onChange=""// {handleInputChange}
                            />
                            <br />
                            {/* { !_.isEmpty(infoToShareList) && infoToShareList.length > 0 &&
                                <Form.Field
                                    checked={privacyShareAddress}
                                    className="ui checkbox checkbox-text"
                                    control={Checkbox}
                                    id="privacyShareAddress"
                                    label={privacyShareAddressLabel}
                                    name="privacyShareAddress"
                                    onChange={handleInputChange}
                                />
                            } */}
                        </Form.Field>
                        {/* {
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
                        } */}
                    </Fragment>
                )
            }
        </Fragment>
    );
};

export default PrivacyOptions;
