import React from 'react';
import { connect } from 'react-redux';
import { reInitNextStep, proceed } from '../../../actions/give';
import {
  populateDonationReviewPage,
  populateGiveReviewPage,
} from '../../../helpers/give/utils';
import GiveAccounts from './GiveAccounts';
import { withTranslation } from '../../../i18n';
import { Link } from '../../../routes'

import {
    Button,
    Container,
    Header,
    Segment,
    Grid,
    List,
    Card,
    Breadcrumb,
} from 'semantic-ui-react';

const square = { width: 175, height: 175 }
class Review extends React.Component {
    constructor(props) {
        super(props)
    }
  componentDidMount() {
    const { dispatch, flowObject } = this.props
    if (flowObject) {
        reInitNextStep(dispatch, flowObject)
    }
  }
  handleSubmit = () => {
    const { dispatch, stepIndex, flowSteps, flowObject } = this.props;
    dispatch(proceed(flowObject, flowSteps[stepIndex+1], stepIndex, true));
  }
  render() {
    const {
        flowObject: {
            currency,
            giveData,
            type,
        },
        companiesAccountsData,
        donationMatchData,
        fund,
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
    let circleLabel = '';
    const {
        sources,
        recipients,
        startsOn,
        totalAmount,
        matchList,
        fromList,
        toList,
        coverFessText,
        givingGroupMessage,
        givingOrganizerMessage,
        groupMatchedBy,
        showTaxOnRecurring,
    } = reviewData
    if(type === 'donations') {
        circleLabel = (giveData.automaticDonation)
                        ? formatMessage('donationRecurringAddLabel')
                        : formatMessage('donationAddLabel');
    }
    return (
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

            {/* <Link className="paragraph-third" route="/donations/tax-receipt-profile">
                Tax
            </Link>
            <br/>
            
            <br/>
            <Link className="paragraph-third" route="/donations/new">
                New
            </Link> */}
      </div>
    );
  }
}

Review.defaultProps = {
    companyDetails: [],
};

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        donationMatchData: state.user.donationMatchData,
        fund: state.user.fund,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
        companyDetails: state.give.companyData,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
    };
}

export default withTranslation(['review', 'giveCommon'])(connect(mapStateToProps)(Review));
