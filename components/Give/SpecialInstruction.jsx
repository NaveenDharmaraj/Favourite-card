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


const SpecialInstruction = (props) => {
    const {
        formatMessage,
        giftType,
        giftTypeList,
        giveFrom,
        handleInputChange,
        infoToShare,
        infoToShareList,
    } = props;
    let repeatGift = null;
    if (giveFrom.type === 'user' || giveFrom.type === 'companies') {
        repeatGift = (
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
