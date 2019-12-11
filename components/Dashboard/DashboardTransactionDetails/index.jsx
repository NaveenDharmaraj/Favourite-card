import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const DashboardTransactionDetails = (props) => {
    const {
        data,
        modalDate,
        informationSharedEntity,
        sourceUserId,
    } = props;
    return (
        <div className="acntActivityContent">
            <List celled className="acntActivityList">
                {
                    data.attributes.transactionType.toLowerCase() === 'donation' && (
                        <Fragment>
                            <List.Item>
                                <List.Content>
                                    <List.Header>Payment Method</List.Header>
                                    {data.attributes.paymentInstrument.data.attributes.description}
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    <List.Header>Tax receipient</List.Header>
                                    {data.attributes.metaValues.full_name}
                                    <br />
                                    {data.attributes.metaValues.address_one}
                                    {', '}
                                    {data.attributes.metaValues.address_two}
                                    <br />
                                    {data.attributes.metaValues.city}
                                    {', '}
                                    {data.attributes.metaValues.province}
                                    {' '}
                                    {data.attributes.metaValues.postal_code}
                                </List.Content>
                            </List.Item>
                            {
                                data.attributes.reason !== '' && (
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>Note to self</List.Header>
                                            {data.attributes.reason}
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                        </Fragment>
                    )
                }
                {
                    data.attributes.transactionType.toLowerCase() === 'matchallocation' && (
                        <List.Item>
                            <List.Content>
                                <List.Header>This match is for a deposit you made</List.Header>
                                {modalDate}
                                <br />
                                $
                                {data.attributes.amount}
                                added to your impact account
                            </List.Content>
                        </List.Item>
                    )
                }
                {
                    (data.attributes.transactionType.toLowerCase() === 'fundallocation'
                    || data.attributes.transactionType.toLowerCase() === 'allocation') && (
                        <Fragment>
                            {
                                data.attributes.destination !== null && (
                                    <Fragment>
                                        {
                                            data.attributes.destination.type.toLowerCase() !== 'user' && (
                                                <List.Item>
                                                    <List.Content>
                                                        <List.Header>Source account</List.Header>
                                                        Impact Account
                                                    </List.Content>
                                                </List.Item>
                                            )
                                        }
                                    </Fragment>
                                )
                            }
                        </Fragment>
                    )
                }
                {
                    data.attributes.transactionType.toLowerCase() === 'fundallocation' && (
                        !_.isEmpty(data.attributes.metaValues.share.name)
                        || !_.isEmpty(data.attributes.metaValues.share.email)
                    ) && (
                        <Fragment>
                            <List.Item>
                                <List.Content>
                                    <List.Header>
                                        Information shared with
                                        {' '}
                                        {informationSharedEntity}
                                    </List.Header>
                                    {
                                        !_.isEmpty(data.attributes.metaValues.share.name) && (
                                            <div>
                                                {data.attributes.metaValues.share.name}
                                            </div>
                                        )
                                    }
                                    {
                                        !_.isEmpty(data.attributes.metaValues.share.email) && (
                                            <div>
                                                {data.attributes.metaValues.share.email}
                                            </div>
                                        )
                                    }
                                </List.Content>
                            </List.Item>
                        </Fragment>
                    )
                }
                {
                    (data.attributes.transactionType.toLowerCase() === 'fundallocation'
                    || data.attributes.transactionType.toLowerCase() === 'allocation') && (
                        <Fragment>
                            {
                                !_.isEmpty(data.attributes.metaValues.dedicate) && (
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>Gift dedication</List.Header>
                                            {
                                                !_.isEmpty(data.attributes.metaValues.dedicate.in_honor_of) && (
                                                    <div>
                                                        In honour of
                                                        {' '}
                                                        {data.attributes.metaValues.dedicate.in_honor_of}
                                                    </div>
                                                )
                                            }
                                            {
                                                !_.isEmpty(data.attributes.metaValues.dedicate.in_memory_of) && (
                                                    <div>
                                                        In memory of
                                                        {' '}
                                                        {data.attributes.metaValues.dedicate.in_memory_of}
                                                    </div>
                                                )
                                            }
                                        </List.Content>
                                    </List.Item>
                                )
                            }
                        </Fragment>
                    )
                }
                {
                    !_.isEmpty(data.attributes.noteToRecipient) && !_.isEmpty(data.attributes.destination) && (
                        <List.Item>
                            <List.Content>
                                {
                                    (data.attributes.destination.type.toLowerCase() === 'user') && (
                                        <List.Header>Message to friend</List.Header>
                                    )
                                }
                                {
                                    (data.attributes.destination.type.toLowerCase() !== 'user') && (
                                        <List.Header>Note to Recipient</List.Header>
                                    )
                                }
                                {data.attributes.noteToRecipient}
                            </List.Content>
                        </List.Item>
                    )
                }
                {
                    !_.isEmpty(data.attributes.noteToRecipient) && _.isEmpty(data.attributes.destination) && (
                        <List.Item>
                            <List.Content>
                                <List.Header>Message to friend</List.Header>
                                {data.attributes.noteToRecipient}
                            </List.Content>
                        </List.Item>
                    )
                }
                {
                    !_.isEmpty(data.attributes.destination) && (
                        <Fragment>
                            {
                                data.attributes.destination.id !== Number(sourceUserId) && (
                                    <Fragment>
                                        {
                                            !_.isEmpty(data.attributes.noteToSelf) && (
                                                <List.Item>
                                                    <List.Content>
                                                        <List.Header>Note to self</List.Header>
                                                        {data.attributes.noteToSelf}
                                                    </List.Content>
                                                </List.Item>
                                            )
                                        }
                                    </Fragment>
                                )
                            }
                        </Fragment>
                    )
                }
                {
                    !_.isEmpty(data.attributes.noteToSelf)
                    && _.isEmpty(data.attributes.destination) && data.attributes.transactionType.toLowerCase() !== 'donation' && (
                        <List.Item>
                            <List.Content>
                                <List.Header>Note to self</List.Header>
                                {data.attributes.noteToSelf}
                            </List.Content>
                        </List.Item>
                    )
                }
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
