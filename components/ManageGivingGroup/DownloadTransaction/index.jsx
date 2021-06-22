import React from 'react';
import { useSelector } from 'react-redux';
import {
    Header,
    Form,
    Button,
    Icon,
    Popup,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

const DownloadTransaction = () => {
    const groupDetails = useSelector((state) => state.group.groupDetails);
    return (
        <div className="basicsettings">
            <Header className="titleHeader transaction">
                Download transaction data
                <p className="SubHeader">Download transaction data and donor information</p>
            </Header>
            <Form>
                <div className="TransactionText">
                    <p className="Transactioncontent">
                        This report includes any information that the donor has chosen to share with Giving Group administrators, such as their name, email, mailing address, and a custom message.
                    </p>
                    <Popup
                        disabled={!_isEmpty(groupDetails) && groupDetails.attributes.transactionsCount}
                        position="bottom center"
                        inverted
                        content="You don’t have transaction data to download."
                        trigger={
                            (
                                <span>
                                    <Button
                                        className="success-btn-rounded-def transactionBtn"
                                        disabled={!_isEmpty(groupDetails) && !groupDetails.attributes.transactionsCount}
                                        href={`/groups/${groupDetails.attributes.slug}.csv`}
                                        target="_blank"
                                    >
                                        <Icon className="transaction" />
                                        Download transaction data
                                    </Button>
                                </span>
                            )
                        }
                    />
                </div>
            </Form>
        </div>
    );
};

export default DownloadTransaction;
