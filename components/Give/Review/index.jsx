import React, {
    Fragment,
  } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
    fetchGroupMatchAmount,
    reInitNextStep,
    proceed
} from '../../../actions/give';
import {
  populateDonationReviewPage,
  populateGiveReviewPage,
} from '../../../helpers/give/utils';
import GiveAccounts from './GiveAccounts';
import DonationListing from './DonationListing';
import AllocationListing from './AllocationListing';
import { withTranslation } from '../../../i18n';
import {Router} from '../../../routes';
import {
    Image,
    Header,
    Segment,
    Grid,
    List,
    Divider,
    Container,
    Button
} from 'semantic-ui-react';

const square = { width: 175, height: 175 }
class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
        };
    }
  componentDidMount() {
    const {
        dispatch,
        flowObject,
        giveGroupDetails,
    } = this.props
    if (flowObject) {
        reInitNextStep(dispatch, flowObject)
    }
    if(flowObject && flowObject.stepsCompleted){
        Router.pushRoute('/dashboard');
    }
    const {
        giveData,
    } = flowObject
    if(giveData.giveTo.type === 'groups' && !_.isEmpty(giveGroupDetails)) {
        const {
            attributes: {
                activeMatch,
                hasActiveMatch,
            },
        } = giveGroupDetails;
        if (!_.isEmpty(activeMatch) && hasActiveMatch) {
            dispatch(fetchGroupMatchAmount(giveData.giveAmount, giveData.giveFrom.value, giveData.giveTo.value));
        }
    }
    window.scrollTo(0, 0);
  }
  handleSubmit = () => {
    const { dispatch, stepIndex, flowSteps, flowObject, currentUser } = this.props;
    this.setState({
        buttonClicked: true,
    });
    dispatch(proceed(flowObject, flowSteps[stepIndex+1], stepIndex, true, currentUser.id));
  }
  render() {
    if ( !_.isEmpty(this.props.flowObject) && this.props.flowObject.stepsCompleted !== true) {
        const {
            flowObject: {
                currency,
                giveData,
                selectedTaxReceiptProfile,
                type,
                sourceAccountHolderId,
                groupId,
            },
            flowSteps,
            companiesAccountsData,
            donationMatchData,
            fund,
            giveGroupDetails,
            groupMatchingDetails,
            paymentInstrumentsData,
            companyDetails: {
                companyPaymentInstrumentsData,
            },
            i18n:{
                language,
            },
            userCampaigns,
            userGroups,
        } = this.props;

        const formatMessage = this.props.t;
        let reviewData = {};
        let activeGroupMatch = null;
        let activeMatchAmount = 0;
        if (!_.isEmpty(giveGroupDetails)) {
            const {
                attributes: {
                    activeMatch,
                    hasActiveMatch,
                },
            } = giveGroupDetails;
            if (!_.isEmpty(activeMatch) && hasActiveMatch) {
                activeGroupMatch = activeMatch;
                if(!_.isEmpty(groupMatchingDetails)) {
                    activeGroupMatch = activeMatch;
                    activeMatchAmount = Number(groupMatchingDetails.attributes.matchAvailable);
                }
            }
        }
        let toURL = `/${type}/${flowSteps[0]}`;
        if (sourceAccountHolderId) {
            toURL = `${toURL}?source_account_holder_id=${sourceAccountHolderId}`;
        }
        if (groupId) {
            toURL = `${toURL}&group_id=${groupId}`;
        }
        if(type === 'donations'){
            reviewData = populateDonationReviewPage(giveData, {
                companiesAccountsData,
                companyPaymentInstrumentsData,
                donationMatchData,
                fund,
                paymentInstrumentsData,
            },
            currency,
            formatMessage,
            language,
            );
        } else {
            reviewData = populateGiveReviewPage(giveData, {
                activeGroupMatch,
                activeMatchAmount,
                companiesAccountsData,
                companyPaymentInstrumentsData,
                donationMatchData,
                fund,
                paymentInstrumentsData,
                userCampaigns,
                userGroups,
            }, currency,
            formatMessage,
            language,);
        }
        const {
            sources,
            recipients,
            startsOn,
            totalAmount,
        } = reviewData;
        let circleLabel = (startsOn)
            ? formatMessage('allocationRecurringLabel')
            : formatMessage('allocationSendingLabel');
        if(type === 'donations') {
            circleLabel = (giveData.automaticDonation)
                            ? formatMessage('donationRecurringAddLabel')
                            : formatMessage('donationAddLabel');
        }
        return (
            <Fragment>
                <div className="reviewWraper">
                    <Grid stackable columns={3}>
                        <Grid.Row>
                            <Grid.Column >
                                <Header as='h2'>{formatMessage('commonFrom')}</Header>
                                <GiveAccounts
                                    accounts={sources}
                                    formatMessage={formatMessage}
                                />
                            </Grid.Column>
                            <Grid.Column textAlign='center' verticalAlign='middle'>
                                <div className="circle-wraper">
                                    <div className='center-table'>
                                        <Segment textAlign='center' circular style={square}>
                                            <Header as='h2'>
                                                {circleLabel}
                                                <Header.Subheader>{totalAmount}</Header.Subheader>
                                            </Header>
                                        </Segment>
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column >
                            <Header as='h2'>{formatMessage('commonTo')}</Header>
                                <GiveAccounts
                                    accounts={recipients}
                                    formatMessage={formatMessage}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                {
                    (type === 'donations') &&
                    <DonationListing
                        disableButton = {this.state.buttonClicked}
                        formatMessage = {formatMessage}
                        handleSubmit = {this.handleSubmit}
                        startsOn={startsOn}
                        tacReceipt={selectedTaxReceiptProfile}
                        noteData={giveData.noteToSelf}
                    />
                }
                {
                    (type !== 'donations') &&
                    <AllocationListing
                        disableButton = {this.state.buttonClicked}
                        formatMessage = {formatMessage}
                        handleSubmit = {this.handleSubmit}
                        data = {reviewData}
                        tacReceipt={selectedTaxReceiptProfile}
                        giveData={giveData}
                        type={type}
                        toURL={toURL}
                    />
                }
        </Fragment>
        );
    }
    return null;
  }
}

Review.defaultProps = {
    companyDetails: [],
};

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        currentUser: state.user.info,
        donationMatchData: state.user.donationMatchData,
        fund: state.user.fund,
        giveGroupDetails: state.give.groupSlugDetails,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
        companyDetails: state.give.companyData,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
        groupMatchingDetails: state.give.groupMatchingDetails,
    };
}

export default withTranslation(['review', 'giveCommon'])(connect(mapStateToProps)(Review));
