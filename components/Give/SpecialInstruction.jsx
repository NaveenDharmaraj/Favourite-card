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
                    Repeat this gift?
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
                <Header as="h3">Special instructions</Header>
            </Form.Field>
            {repeatGift}
            <Form.Field>
                <label htmlFor="infoToShare">
                    Info to share
                </label>
                <Popup
                    content="When you give anonymously, none of your personal details are shared with the recipient.  If you don’t give anonymously, you may choose what details you’d like us to share."
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
}

export default SpecialInstruction;
