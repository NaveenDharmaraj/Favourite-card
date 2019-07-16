import _ from 'lodash';
import React, {
    Fragment,
} from 'react';
import {
    defineMessages,
} from 'react-intl';
import {
    Checkbox,
    Divider,
    Form,
    Header,
    Select,
} from 'semantic-ui-react';
import BaseComponent from 'client/common/components/BaseComponent';
import 'client/giving/common/common.scss';

const messageList = defineMessages({
    forGivingCampaignLabel: {
        defaultMessage: 'For Giving Campaign',
        description: 'Label for For Giving Campaign',
        id: 'groups.allocations.forGivingCampaignLabel',
    },
    forGivingCampaignOrganizersLabel: {
        defaultMessage: 'For Giving Campaign organizers',
        description: 'Label for For Giving Campaign Organizers',
        id: 'groups.allocations.forGivingCampaignOrganizersLabel',
    },
    forGivingGroupLabel: {
        defaultMessage: 'For Giving Group',
        description: 'Label for For Giving Group',
        id: 'groups.allocations.forGivingGroupLabel',
    },
    forGivingGroupOrganizersLabel: {
        defaultMessage: 'For Giving Group organizers',
        description: 'Label for For Giving Group Organizers',
        id: 'groups.allocations.forGivingGroupOrganizersLabel',
    },
    mycampaigns: {
        defaultMessage: 'my Campaign',
        description: 'for my Campaign',
        id: 'groups.allocations.myCampaigns',
    },
    mycompanies: {
        defaultMessage: 'my Company',
        description: 'for my Company',
        id: 'groups.allocations.myCompanies',
    },
    mygroups: {
        defaultMessage: 'my Group',
        description: 'for my group',
        id: 'groups.allocations.myGroups',
    },
    privacyDataEmail: {
        defaultMessage: 'email',
        description: 'Label for email',
        id: 'groups.allocations.privacyDataEmail',
    },
    privacyDataPostal: {
        defaultMessage: 'postal',
        description: 'Label for postal',
        id: 'groups.allocations.privacyDataPostal',
    },
    privacyOptionsLabel: {
        defaultMessage: 'Privacy options',
        description: 'Label for privacy options',
        id: 'groups.allocations.privacyOptionsLabel',
    },
    selectNameAndAddressLabel: {
        defaultMessage: 'Select a name and address',
        description: 'Label for Select a name and address',
        id: 'groups.allocations.selectNameAndAddressLabel',
    },
    shareCampaignPrivacyGiftAmount: {
        defaultMessage: 'Share my gift amount with Giving Campaign I’m giving to',
        description: 'Message to ask user to share details about gift amount',
        id: 'groups.allocations.shareCampaignPrivacyGiftAmount',
    },
    shareCampaignPrivacyName: {
        defaultMessage: 'Share my {giveFrom} name with the Giving Campaign I’m giving to',
        description: 'Message to ask user to share details about Name ',
        id: 'groups.allocations.shareCampaignPrivacyName',
    },
    shareCampaignPrivacyPostal: {
        defaultMessage: 'Share my {privacyData} address with the Giving Campaign organizers',
        description: 'Message to ask user to share details about Postal Address & Email ',
        id: 'groups.allocations.shareCampaignPrivacyPostal',
    },
    shareCampaignUserName: {
        defaultMessage: 'Share my name with the Giving Campaign I’m giving to',
        description: 'Message to ask user to share name to campaign',
        id: 'groups.allocations.shareCampaignUserName',
    },
    shareGroupPrivacyGiftAmount: {
        defaultMessage: 'Share my gift amount with Giving Group I’m giving to',
        description: 'Message to ask user to share details about gift amount',
        id: 'groups.allocations.shareGroupPrivacyGiftAmount',
    },
    shareGroupPrivacyName: {
        defaultMessage: 'Share {giveFrom} name with the Giving Group I’m giving to',
        description: 'Message to ask user to share details about Name ',
        id: 'groups.allocations.shareGroupPrivacyName',
    },
    shareGroupPrivacyPostal: {
        defaultMessage: 'Share my {privacyData} address with the Giving Group organizers',
        description: 'Message to ask user to share details about Postal Address & Email ',
        id: 'groups.allocations.shareGroupPrivacyPostal',
    },
    shareGroupUserName: {
        defaultMessage: 'Share my name with the Giving Group I’m giving to',
        description: 'Message to ask user to share name to group',
        id: 'groups.allocations.shareGroupUserName',
    },
});
class PrivacyOptions extends BaseComponent {
    render() {
        const {
            formatMessage,
            handleInputChange,
            giveFrom,
            giveToType,
            infoToShare,
            infoToShareList,
            privacyShareAddress,
            privacyShareAmount,
            privacyShareEmail,
            privacyShareName,
        } = this.props;
        let privacyShareNameLabel = null;
        const privacyShareAmountLabel = formatMessage(messageList[`share${giveToType}PrivacyGiftAmount`]);
        let privacyShareEmailLabel = null;
        let privacyShareAddressLabel = null;
        const privacyEmail = formatMessage(messageList.privacyDataEmail);
        const privacyPostal = formatMessage(messageList.privacyDataPostal);
        const myGiveFromType = (giveFrom.type !== 'user') ? formatMessage(messageList[`my${giveFrom.type}`]) : '';

        switch (giveFrom.type) {
            case 'user':
                privacyShareNameLabel = formatMessage(messageList[`share${giveToType}UserName`]);
                privacyShareEmailLabel = formatMessage(messageList[`share${giveToType}PrivacyPostal`], { privacyData: privacyEmail });
                privacyShareAddressLabel = formatMessage(messageList[`share${giveToType}PrivacyPostal`], { privacyData: privacyPostal });
                break;
            case 'companies':
                privacyShareNameLabel = formatMessage(messageList[`share${giveToType}PrivacyName`], { giveFrom: myGiveFromType });
                break;
            case 'groups':
                privacyShareNameLabel = formatMessage(messageList[`share${giveToType}PrivacyName`], { giveFrom: myGiveFromType });
                break;
            case 'campaigns':
                privacyShareNameLabel = formatMessage(messageList[`share${giveToType}PrivacyName`], { giveFrom: myGiveFromType });
                break;
            default: break;
        }
        return (
            <Fragment>
                <Form.Field>
                    <Divider className="dividerMargin" />
                </Form.Field>
                <Form.Field>
                    <Header as="h3">{formatMessage(messageList.privacyOptionsLabel)}</Header>
                </Form.Field>
                <Form.Field>
                    <label
                        className="privacy-header"
                        htmlFor="privacyShareName"
                    >
                        {formatMessage(messageList[`forGiving${giveToType}Label`])}
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
                {
                    (giveFrom.type === 'user') && (
                        <Fragment>
                            <Form.Field>
                                <label
                                    className="privacy-header"
                                    htmlFor="privacyShareEmail"
                                >
                                    {
                                        formatMessage(
                                            messageList[`forGiving${giveToType}OrganizersLabel`],
                                        )
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
                                { !_.isEmpty(infoToShareList) && infoToShareList.length > 0 &&
                                    <Form.Field
                                        checked={privacyShareAddress}
                                        className="ui checkbox checkbox-text"
                                        control={Checkbox}
                                        id="privacyShareAddress"
                                        label={privacyShareAddressLabel}
                                        name="privacyShareAddress"
                                        onChange={handleInputChange}
                                    />
                                }
                            </Form.Field>
                            {
                                !_.isEmpty(infoToShareList) && !!privacyShareAddress && (
                                    <Form.Field>
                                        <label htmlFor="infoToShare">
                                            {formatMessage(messageList.selectNameAndAddressLabel)}
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
    }
}

export default PrivacyOptions;
