import React from 'react';
import { useSelector } from 'react-redux';
import {
    Header,
    Form,
    Button,
    Icon,
} from 'semantic-ui-react';

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
                    <p className="Transactioncontent">This report includes any information that the donor has chosen to share with Giving Group administrators, such as their name, email, mailing address, and a custom message.</p>
                    <a href={`/groups/${groupDetails.attributes.slug}.csv`} target="_blank">
                        <Button
                            className="success-btn-rounded-def transactionBtn"
                        >
                            <Icon className="transaction" />
                            Download transaction data
                        </Button>
                    </a>
                </div>
            </Form>
        </div>
    );
};

export default DownloadTransaction;
