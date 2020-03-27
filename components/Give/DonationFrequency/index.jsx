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
        formData,
        handleInputChange,
        handlegiftTypeButtonClick,
        language,
    } = props;
    return (
        <>
            <div className="mb-1">
                <Form.Field>
                    <label>Frequency</label>
                    <Popup
                        content={<div>{formatMessage('automaticDonationPopup')}</div>}
                        position="top center"
                        trigger={
                            <Icon
                                color="blue"
                                name="question circle"
                                size="large"
                            />
                        }
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        className="chimpRadio font-w-n"
                        label='Add once'
                        name='automaticDonation'
                        value={0}
                        checked={!formData.automaticDonation}
                        onChange={handleInputChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        className="chimpRadio font-w-n"
                        label='Add monthly'
                        name='automaticDonation'
                        value={1}
                        checked={!!formData.automaticDonation}
                        onChange={handleInputChange}
                    />
                </Form.Field>
            </div>
            {
                ((!!formData.automaticDonation) && (
                    <>
                        <div className="mb-1-2">
                            <Button
                                className={(formData.giftType.value ===1 ? 'btn-basic-outline selected-btn': 'btn-basic-outline' )}
                                size="small"
                                type="button"
                                active={formData.giftType.value === 1}
                                onClick={handlegiftTypeButtonClick}
                                value={1}
                            >
                                1st of every month
                            </Button>
                            <Button
                                className={(formData.giftType.value ===15 ? 'btn-basic-outline selected-btn': 'btn-basic-outline' )}
                                active={formData.giftType.value === 15}
                                type="button"
                                size="small"
                                onClick={handlegiftTypeButtonClick}
                                value={15}
                            >
                                15th of every month
                            </Button>
                        </div>
                        <div className="recurringMsg  mt-1 mb-2">
                            {formatMessage(
                                'donationRecurringDateNote',
                                { 
                                    recurringDate: setDateForRecurring(formData.giftType.value, formatMessage, language)
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
