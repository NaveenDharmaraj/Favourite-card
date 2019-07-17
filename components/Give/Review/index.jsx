import React, {
    Fragment,
  } from 'react';
import { connect } from 'react-redux';
import { reInitNextStep, proceed } from '../../../actions/give';
import {
  populateDonationReviewPage,
} from '../../../helpers/give/utils';
import GiveAccounts from './GiveAccounts';
import { withTranslation } from '../../../i18n';
import { Link } from '../../../routes'

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

            {/* <Link className="paragraph-third" route="/donations/tax-receipt-profile">
                Tax
            </Link>
            <br/>
            
            <br/>
            <Link className="paragraph-third" route="/donations/new">
                New
            </Link> */}
        </div>
        <List divided relaxed size={'large'} className="reviewList">
            <List.Item>
                <List.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                                <Image verticalAlign='middle' src="../../../../static/images/note.svg" className="imgTax"/>
                                <List.Header >Tax receipt recipient</List.Header>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="reviewList-description">
                                    <div className="list-desc-head">Demo UI</div>
                                    <div>test, test</div>
                                    <div>Doylehave, MB A0B2J0</div>
                                    <a href="">Change</a>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                                <List.Header >Starts on</List.Header>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="reviewList-description">
                                    <div className="list-desc-head">August 1, 2019</div>
                                    <div>Your credit card will be charged each month starting on this date. Each time, a tax receipt will automatically be posted to your CHIMP Account and the transaction will appear as "CHIMP FDN * DONATION".</div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Content>
            </List.Item>
            <List.Item>
                <List.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={8} computer={8} className="grdTaxDisplay">
                                <List.Header >Note to self</List.Header>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <div className="reviewList-description">
                                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Content>
            </List.Item>
        </List>
        <Divider />
        <Divider hidden/>
        <Container textAlign='center'>
            <Button primary className="btnReview">Schedule monthly transaction</Button>
            <Divider hidden/>
            <p className="paragraph">or <a href="">make changes</a></p>
            <p className="paragraph">Completed transactions are non-refundable, but you can cancel your monthly transactions before the date they're scheduled to occur.'</p>
        </Container>
      </Fragment>
      
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

export default withTranslation(['review', 'giveCommon'])(connect(mapStateToProps)(Review));
