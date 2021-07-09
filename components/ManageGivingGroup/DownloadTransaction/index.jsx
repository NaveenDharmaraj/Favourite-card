import React from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    Header,
    Form,
    Button,
    Icon,
    Popup,
    Responsive,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

const DownloadTransaction = () => {
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const dispatch = useDispatch();

    const resetPageViewStatus = () => {
        dispatch({
            payload: {
                pageStatus: {
                    menuView: true,
                    pageView: false,
                },
            },
            type: 'SET_MANAGE_PAGE_STATUS',
        });
    };

    return (
        <div className="basicsettings">
            <Header className="titleHeader transaction">
                <Responsive minWidth={320} maxWidth={767}>
                    <span>
                        <i
                            aria-hidden="true"
                            className="back_to_menu icon"
                            onClick={resetPageViewStatus}
                        />
                    </span>
                </Responsive>
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
                        content="There’s no transaction data to download yet."
                        trigger={
                            (
                                <span>
                                    <Button
                                        className={`success-btn-rounded-def transactionBtn ${!groupDetails.attributes.transactionsCount ? 'data_disabled' : ''}`}
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
