import React from 'react';
import {
    Button,
    Image,
    List,
    Responsive,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../../../routes';
import docIcon from '../../../static/images/icons/icon-document.svg?next-images-ignore=true';

const IssuedTaxReceiptCard = (props) => {
    const {
        issuedTaxReceipt,
    } = props;
    const {
        address_one,
        address_two,
        city,
        province,
        country,
        postal_code,
        full_name,
    } = issuedTaxReceipt;

    return (
        <List.Item>
            <Responsive minWidth={768}>
                <List.Content floated="right">
                    <Button className="blue-bordr-btn-round-def c-small" onClick={() => { Router.pushRoute(`/user/tax-receipts/${issuedTaxReceipt.id}`); }}> See issued receipts</Button> 
                </List.Content>
            </Responsive>
            <Image className="greyIcon" src={docIcon} />
            <List.Content>
                <List.Header className="font-s-15 mb-1-2">{full_name}</List.Header>
                <p className="font-s-14">
                    {!_isEmpty(address_one) && `${address_one}, `}
                    {!_isEmpty(address_two) && `${address_two}, `}
                    {!_isEmpty(city) && `${city}, `}
                    {!_isEmpty(province) && `${province}, `}
                    {!_isEmpty(country) && `${country}, `}
                    {!_isEmpty(postal_code) && `${postal_code}`}
                </p>
                <Responsive minWidth={320} maxWidth={767}>
                    <List.Content className="mt-1">
                        <Button className="blue-bordr-btn-round-def c-small" onClick={() => { Router.pushRoute(`/user/tax-receipts/${issuedTaxReceipt.id}`); }}> See issued receipts</Button>
                    </List.Content>
                </Responsive>
            </List.Content>
        </List.Item>
    );
};

IssuedTaxReceiptCard.propTypes = {
    issuedTaxReceipt: PropTypes.shape({
        full_name: PropTypes.string,
        id: PropTypes.string,
    }),

};
IssuedTaxReceiptCard.defaultProps = {
    issuedTaxReceipt: null,
};

export default IssuedTaxReceiptCard;
