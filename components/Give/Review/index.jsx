import React from 'react';
import { connect } from 'react-redux';
import { reInitNextStep, proceed } from '../../../actions/give';
import {
  populateDonationReviewPage,
} from '../../../helpers/give/utils';
import GiveAccounts from './GiveAccounts';
import { withTranslation } from '../../../i18n';

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
    } = this.props;
    const formatMessage = this.props.t;
    const {
        sources,
        recipients,
        totalAmount,
    } = populateDonationReviewPage(giveData, {
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
    let circleLabel = '';
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
    };
}

export default withTranslation(['review', 'common'])(connect(mapStateToProps)(Review));
