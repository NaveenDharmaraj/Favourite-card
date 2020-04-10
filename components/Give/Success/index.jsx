import React, {
    Fragment,
    useEffect,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Container, Grid, Image, Header, Button,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import PropTypes from 'prop-types';

import {
    formatCurrency,
    formatAmount,
} from '../../../helpers/give/utils';
import { withTranslation } from '../../../i18n';
import { reInitNextStep } from '../../../actions/give';
import { Link } from '../../../routes';
// This image is dummy image since we dont have a proper image
import successImg from '../../../static/images/give-success-screen-illustration.png';
import FlowBreadcrumbs from '../FlowBreadcrumbs';

import AddMoneySuccess from './AddMoneySuccess';
import CharitySuccess from './CharitySuccess';
import GroupSuccess from './GroupSuccess';
import P2PSuccess from './P2PSuccess';

const Success = (props) => {
    const {
        currentStep,
        currentUser,
        dispatch,
        donationMatchData,
        flowObject,
        flowSteps,
        giveGroupDetails,
        successData,
        t: formatMessage,
        i18n: {
            language,
        },
    } = props;
    const {
        attributes: {
            displayName,
            firstName,
            lastName,
        },
    } = currentUser;
    const {
        quaziSuccessStatus,
    } = successData;
    const thankName = (_isEmpty(displayName)) ? displayName : `${firstName} ${lastName}`;
    let firstParagraph = null;
    if (quaziSuccessStatus && successData.type === 'donations') {
        firstParagraph = formatMessage('quaziDonationSuccessMessage', {
            name: thankName,
        });
    } else {
        firstParagraph = successData.type === 'donations'
            ? formatMessage('addMoneyFirstText', { name: thankName })
            : formatMessage('allocationFirstText', { name: thankName });
    }
    useEffect(() => {
        if (flowObject) {
            reInitNextStep(dispatch, flowObject);
        }
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);

    const renderQuaziSuccess = () => {
        const {
            currency,
            giveData: {
                donationAmount,
            },
        } = successData;
        const dashboardLink = '/dashboard';
        const dashBoardButtonText = formatMessage('goToYourDashboard');
        const secondParagraph = formatMessage('quaziDonationSuccessMessageTwo', {
            amount: formatCurrency(formatAmount(Number(donationAmount)), language, currency),
        });
        return (
            <Fragment>
                <p className="text-center">
                    {secondParagraph}
                </p>
                <div className="text-center mt-1">
                    <Link route={dashboardLink}>
                        <Button className="blue-btn-rounded-def flowConfirmBtn second_btn">
                            {dashBoardButtonText}
                        </Button>
                    </Link>
                </div>
            </Fragment>
        );
    };

    const renderSuccessPage = () => {
        if (successData.quaziSuccessStatus) {
            return renderQuaziSuccess();
        }

        switch (flowObject.type) {
            case 'donations':
                return (
                    <AddMoneySuccess
                        donationMatchData={donationMatchData}
                        successData={successData}
                    />
                );
            case 'give/to/charity':
                return (
                    <CharitySuccess
                        successData={successData}
                    />
                );
            case 'give/to/group':
                return (
                    <GroupSuccess
                        successData={successData}
                        giveGroupDetails={giveGroupDetails}
                    />
                );
            case 'give/to/friend':
                return (
                    <P2PSuccess
                        successData={successData}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <div className="flowSuccess">
            <Container>
                <FlowBreadcrumbs
                    currentStep={currentStep}
                    formatMessage={formatMessage}
                    steps={flowSteps}
                    flowType={flowObject.type}
                />
                <Grid centered verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={14} computer={12}>
                            <div className="flowSuccessImg">
                                <Image src={successImg} centered />
                                <div className="mt-2 flowSuccessImgHeading">
                                    <Header as="h4" textAlign="center" >
                                        {firstParagraph}
                                    </Header>
                                    <div className="sub">
                                        {renderSuccessPage()}
                                    </div>
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
};

Success.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            displayName: PropTypes.string,
        }),
    }),
    dispatch: PropTypes.func,
    donationMatchData: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any,
        value: PropTypes.string,
    })),
    i18n: PropTypes.shape({
        language: PropTypes.string,
    }),
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            donationAmount: PropTypes.string,
            donationMatch: PropTypes.shape({
                id: PropTypes.any,
                value: PropTypes.string,
            }),
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            }),
            giveAmount: PropTypes.string,
            giveFrom: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
                type: PropTypes.string,
            }),
            giveTo: PropTypes.shape({
                eftEnabled: PropTypes.bool,
                name: PropTypes.string,
                slug: PropTypes.string,
                text: PropTypes.string,
                type: PropTypes.string,
                value: PropTypes.string,
            }),
            recipients: PropTypes.arrayOf(PropTypes.element),
        }),
        quaziSuccessStatus: PropTypes.bool,
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
Success.defaultProps = {
    currentUser: {
        attributes: {
            displayName: '',
        },
    },
    dispatch: () => { },
    donationMatchData: [],
    i18n: {
        language: 'en',
    },
    successData: {
        giveData: {
            donationAmount: '',
            donationMatch: {
                id: null,
                value: null,
            },
            giftType: {
                value: null,
            },
            giveAmount: '',
            giveFrom: {
                name: '',
                slug: '',
                value: '',
            },
            giveTo: {
                eftEnabled: false,
                name: '',
                slug: '',
                text: '',
                type: '',
                value: null,
            },
            recipients: [],
        },
        quaziSuccessStatus: false,
        stepsCompleted: false,
        type: null,
    },
    t: () => { },
};
const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    donationMatchData: state.user.donationMatchData,
    giveGroupDetails: state.give.groupSlugDetails,
    successData: state.give.successData,
});


export { Success };
export default withTranslation([
    'success',
])(connect(mapStateToProps)(Success));
