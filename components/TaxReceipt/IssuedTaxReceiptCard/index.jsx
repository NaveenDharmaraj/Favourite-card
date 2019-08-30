import React from 'react';
import {
    Button,
    Image,
    List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import docIcon from '../../../static/images/icons/icon-document.svg?next-images-ignore=true';

const IssuedTaxReceiptCard = (props) => {
    const {
        issuedTaxReceipt,
    } = props;

    return (
        <List.Item>
            <List.Content floated="right">
                <Button className="blue-bordr-btn-round-def c-small" onClick={() => { props.renderdonationDetailShow(issuedTaxReceipt.id, issuedTaxReceipt, false); }}>See issued receipts</Button>
            </List.Content>
            <Image className="greyIcon" src={docIcon} />
            <List.Content>
                <List.Header className="font-s-15 mb-1-2">{issuedTaxReceipt.full_name}</List.Header>
            </List.Content>
        </List.Item>
    );
};

IssuedTaxReceiptCard.propTypes = {
    issuedTaxReceipt: PropTypes.shape({
        full_name: PropTypes.string,
        id: PropTypes.string,
    }),
    renderdonationDetailShow: PropTypes.func,

};
IssuedTaxReceiptCard.defaultProps = {
    issuedTaxReceipt: null,
    renderdonationDetailShow: () => {},
};

export default IssuedTaxReceiptCard;
