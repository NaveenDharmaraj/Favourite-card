import React from 'react';
import _ from 'lodash';
import {
    List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const DashboardTransactionDetails = (props) => {
    const {
        data,
        modalDate,
        informationSharedEntity,
        sourceUserId,
    } = props;
    const dataArrayTransaction = [];
    let dataObjectData = {};
    if (data.attributes.transactionType.toLowerCase() === 'donation') {
        dataObjectData = {};
        dataObjectData.labelValue = 'Payment method';
        dataObjectData.transactionValue = data.attributes.paymentInstrument.data.attributes.description;
        dataArrayTransaction.push(dataObjectData);
        if (data.attributes.metaValues.address_one !== null && data.attributes.transactionType.toLowerCase() === 'donation') {
            dataObjectData = {};
            dataObjectData.labelValue = 'Tax receipt recipient';
            const address = !_.isEmpty(data.attributes.metaValues.address_two) ? `${data.attributes.metaValues.address_one} ${data.attributes.metaValues.address_two}` : data.attributes.metaValues.address_one;
            dataObjectData.transactionValue = `${data.attributes.metaValues.full_name} <br /> ${address} <br /> ${data.attributes.metaValues.city}, ${data.attributes.metaValues.province} ${data.attributes.metaValues.postal_code}`;
            dataArrayTransaction.push(dataObjectData);
        }
    }
    
    if (data.attributes.transactionType.toLowerCase() === 'fundallocation' || data.attributes.transactionType.toLowerCase() === 'allocation') {
        if (((_.isEmpty(data.attributes.destination) || (!_.isEmpty(data.attributes.destination) && data.attributes.destination.id !== Number(sourceUserId))) && data.attributes.source.id === Number(sourceUserId))) {
            dataObjectData = {};
            dataObjectData.labelValue = 'Source account';
            dataObjectData.transactionValue = 'Impact Account';
            dataArrayTransaction.push(dataObjectData);
        }
    }
    if (!_.isEmpty(data.attributes.metaValues.share)) {
        dataObjectData = {};
        if (!_.isEmpty(data.attributes.metaValues.share.name)) {
            dataObjectData.labelValue = `Information shared with ${informationSharedEntity}`;
            dataObjectData.transactionValue = `${data.attributes.metaValues.share.name} <br />`;
        }
        if (!_.isEmpty(data.attributes.metaValues.share.email)) {
            dataObjectData.labelValue = `Information shared with ${informationSharedEntity}`;
            dataObjectData.transactionValue += `${data.attributes.metaValues.share.email} <br />`;
        }
        if (!_.isEmpty(data.attributes.metaValues.share.address_one)) {
            dataObjectData.labelValue = `Information shared with ${informationSharedEntity}`;
            const address = !_.isEmpty(data.attributes.metaValues.share.address_two) ? `${data.attributes.metaValues.share.address_one} ${data.attributes.metaValues.share.address_two}` : data.attributes.metaValues.share.address_one;
            dataObjectData.transactionValue += `${address} <br /> ${data.attributes.metaValues.share.city}, ${data.attributes.metaValues.share.province} ${data.attributes.metaValues.share.postal_code}`;
        }
        if (!_.isEmpty(dataObjectData)) {
            dataArrayTransaction.push(dataObjectData);
        }
    }
    if (!_.isEmpty(data.attributes.metaValues.dedicate)) {
        dataObjectData = {};
        dataObjectData.labelValue = 'Gift dedication';
        if (!_.isEmpty(data.attributes.metaValues.dedicate.in_honor_of)) {
            dataObjectData.transactionValue = `In honour of ${data.attributes.metaValues.dedicate.in_honor_of}`;
            dataArrayTransaction.push(dataObjectData);
        } else if (!_.isEmpty(data.attributes.metaValues.dedicate.in_memory_of)) {
            dataObjectData.transactionValue = `In memory of ${data.attributes.metaValues.dedicate.in_memory_of}`;
            dataArrayTransaction.push(dataObjectData);
        }
    }
    if (!_.isEmpty(data.attributes.noteToRecipient)) {
        dataObjectData = {};
        dataObjectData.labelValue = 'Note to recipient';
        if (!_.isEmpty(data.attributes.destination)) {
            if (data.attributes.destination.id === Number(sourceUserId)) {
                dataObjectData.labelValue = `Message from ${data.attributes.source.name}`;
            }
            if (data.attributes.destination.type.toLowerCase() === 'user' && data.attributes.destination.id !== Number(sourceUserId)) {
                dataObjectData.labelValue = `Message to friend`;
            }
        }
        dataObjectData.transactionValue = data.attributes.noteToRecipient;
        dataArrayTransaction.push(dataObjectData);
    }
    if (!_.isEmpty(data.attributes.noteToSelf) || !_.isEmpty(data.attributes.reason)) {
        if (!_.isEmpty(data.attributes.destination)) {
            if (data.attributes.destination.id !== Number(sourceUserId)) {
                dataObjectData = {};
                dataObjectData.labelValue = 'Note to self';
                dataObjectData.transactionValue = data.attributes.noteToSelf;
                dataArrayTransaction.push(dataObjectData);
            } else if (data.attributes.destination.id === Number(sourceUserId) && data.attributes.transactionType.toLowerCase() === 'donation') {
                dataObjectData = {};
                dataObjectData.labelValue = 'Note to self';
                dataObjectData.transactionValue = data.attributes.reason;
                dataArrayTransaction.push(dataObjectData);
            }
        } else if (_.isEmpty(data.attributes.destination) && !_.isEmpty(data.attributes.noteToSelf)) {
            dataObjectData = {};
            dataObjectData.labelValue = 'Note to self';
            dataObjectData.transactionValue = data.attributes.noteToSelf;
            dataArrayTransaction.push(dataObjectData);
        }
    }
    if (data.attributes.transactionType.toLowerCase() === 'matchallocation') {
        dataObjectData.labelValue = 'This match is for a deposit you made';
        dataObjectData.transactionValue = `${modalDate} <br /> ${data.attributes.amount} added to your impact account`;
        dataArrayTransaction.push(dataObjectData);
    }
    let transactionDetails = '';
    if (dataArrayTransaction && _.size(dataArrayTransaction) > 0) {
        transactionDetails = dataArrayTransaction.map((dataTran) => {
            return (
                <List.Item>
                    <List.Content>
                        <List.Header>{dataTran.labelValue}</List.Header>
                        {ReactHtmlParser(dataTran.transactionValue)}
                    </List.Content>
                </List.Item>
            );
        });
    }

    return (
        <div className="acntActivityContent">
            <List celled className="acntActivityList">
                {transactionDetails}
            </List>
        </div>
    );
};

DashboardTransactionDetails.propTypes = {
    data: {
        attributes: {
            transactionType: PropTypes.string,
        },
    },
    informationSharedEntity: PropTypes.string,
    modalDate: PropTypes.string,
    sourceUserId: PropTypes.string,
};

DashboardTransactionDetails.defaultProps = {
    data: {
        attributes: {
            transactionType: '',
        },
    },
    informationSharedEntity: '',
    modalDate: '',
    sourceUserId: '',
};


export default DashboardTransactionDetails;
