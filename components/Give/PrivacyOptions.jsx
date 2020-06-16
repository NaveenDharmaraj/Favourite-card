import _ from 'lodash';
import React, {
    Fragment,
} from 'react';
import {
    Checkbox,
    Form,
    Select,
} from 'semantic-ui-react';

const PrivacyOptions = (props) => {
    const {
        formatMessage,
        giveFrom,
        giveToType,
        nameToShare,
        privacyNameOptions,
        privacyShareAmount,
        handleInputChange,
        hasCampaign,
        infoToShare,
        infoToShareList,
    } = props;
    const privacyShareAmountLabel = formatMessage(`privacyOptions:sharePrivacyGiftAmount`);
    return (
        <Fragment>
            <Form.Field className="give_flow_field">
                <label
                    className="privacy-header"
                    htmlFor="privacyShareName"
                >
                    {formatMessage(`privacyOptions:forGiving${giveToType}Label`)}
                </label>
                <br />
                <Form.Field
                    className="dropdownWithArrowParent"
                    control={Select}
                    id="nameToShare"
                    name="nameToShare"
                    onChange={handleInputChange}
                    options={privacyNameOptions}
                    value={nameToShare.value}

                />
                <Form.Field
                    checked={privacyShareAmount}
                    className="ui checkbox checkbox-text f-weight-n cp_chkbx"
                    control={Checkbox}
                    id="privacyShareAmount"
                    label={privacyShareAmountLabel}
                    name="privacyShareAmount"
                    onChange={handleInputChange}
                />
            </Form.Field>
            {(giveFrom.type === 'user') && (
                <Fragment>
                    {
                        !_.isEmpty(infoToShareList) && (
                            <Form.Field className="give_flow_field">
                                {(!!hasCampaign) ? (
                                    <>
                                        <label htmlFor="infoToShare">
                                            {formatMessage('privacyOptions:selectNameAndAddressLabelWithCampaign')}
                                        </label>
                                        <span className="givingInfoText">This group supports a campaign—admins of both will see the info you share.</span>
                                    </>
                                ) : (
                                    <label htmlFor="infoToShare">
                                        {formatMessage('privacyOptions:selectNameAndAddressLabel')}
                                    </label>
                                )
                                }

                                <Form.Field
                                    className="dropdownWithArrowParent"
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
