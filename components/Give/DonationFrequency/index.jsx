import React, {
} from 'react';
import {
    Form,
    Button,
    Icon,
    label,
    Popup,
    Radio,
} from 'semantic-ui-react';

import {
    setDateForRecurring,
} from '../../../helpers/give/utils';

function DonationFrequency(props) {
    const {
        formatMessage,
        giftType,
        handlegiftTypeButtonClick,
        language,
        isGiveFlow,
        recurringDisabled,
        isCampaign,
    } = props;
    return (
        <>
            <div className="give_flow_field Frequencybottom">
                <Form.Field className="">
                    <label>Frequency</label>
                    <Popup
                        content={<div>{formatMessage('giveCommon:automaticDonationPopup')}</div>}
                        position="top center"
                        trigger={(
                            <Icon
                                color="blue"
                                name="question circle"
                                size="large"
                            />
                        )}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        className="chimpRadio font-w-n"
                        label={isGiveFlow ? 'Send once' : 'Add once'}
                        name='automaticDonation'
                        value={0}
                        checked={!giftType.value}
                        onChange={handlegiftTypeButtonClick}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        className="chimpRadio font-w-n"
                        label={isGiveFlow ? 'Send monthly' : 'Add monthly'}
                        name='automaticDonation'
                        value={1}
                        disabled={recurringDisabled}
                        checked={!!giftType.value}
                        onChange={handlegiftTypeButtonClick}
                    />
                </Form.Field>
                {
                    (recurringDisabled && (
                        <span data-test="Give_DonationFrequency_givingInfoText"  className="givingInfoText">This {(isCampaign ? 'Campaign': 'Giving Group' )} does not accept monthly gifts.</span>
                    ))
                }
            </div>
            {
                ((giftType.value > 0) && (
                    <>
                        <div data-test="Give_DonationFrequency_gifttype" className="mt-1 mb-1">
                            <Button
                                className={(giftType.value ===1 ? 'btn-basic-outline selected-btn': 'btn-basic-outline' )}
                                size="small"
                                type="button"
                                active={giftType.value === 1}
                                onClick={handlegiftTypeButtonClick}
                                value={1}
                            >
                                1st of every month
                            </Button>
                            <Button
                                className={(giftType.value ===15 ? 'btn-basic-outline selected-btn': 'btn-basic-outline' )}
                                active={giftType.value === 15}
                                type="button"
                                size="small"
                                onClick={handlegiftTypeButtonClick}
                                value={15}
                            >
                                15th of every month
                            </Button>
                        </div>
                        <div className="recurringMsg  mt-1 mb-1">
                            {formatMessage(
                                'donationRecurringDateNote',
                                {
                                    recurringDate: setDateForRecurring(giftType.value, formatMessage, language)
                                },
                            )}
                        </div>
                        
                    </>
                ))
            }
            </>
    )
}
export default DonationFrequency;
export { DonationFrequency };
