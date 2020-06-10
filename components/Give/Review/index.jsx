import React, {
    Fragment,
  } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { reInitNextStep, proceed } from '../../../actions/give';
import {
    populateDonationReviewPage,
    populateGiveReviewPage,
    populateP2pReviewPage,
} from '../../../helpers/give/utils';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import { withTranslation } from '../../../i18n';
import {
    Router,
    Link,
} from '../../../routes';
import {
    Image,
    Header,
    Table,
    Grid,
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
        const { dispatch, flowObject } = this.props
        if (flowObject) {
            reInitNextStep(dispatch, flowObject)
        }
        if(flowObject && flowObject.stepsCompleted){
            Router.pushRoute('/dashboard');
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

    renderListing(list) {
        const formatMessage = this.props.t;
        if(!_.isEmpty(list)){
            return (
                <Fragment>
                    {list.map((data) => {
                        return (
                                <Table.Row>
                                    <Table.Cell className="tableOne" ><b>{formatMessage(data.name)}</b></Table.Cell>
                                    <Table.Cell className="tabletwo" >{ data.value}</Table.Cell>
                                    <Table.Cell ></Table.Cell>
                                </Table.Row>
                        )
                    })}
                </Fragment>

            );
        }
        return null;
    }

    renderSendingListing(sendList) {
        if(!_.isEmpty(sendList)){
            return (
                <Fragment>
                    {sendList.map((data) => {
                        return (
                            <Table.Row>
                                <Table.Cell className="table-name">{data.displayName}</Table.Cell>
                                <Table.Cell textAlign='right'><b>{data.amount}</b></Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Fragment>
            );
        }
        return null;
    }

    render() {
        if ( !_.isEmpty(this.props.flowObject) && this.props.flowObject.stepsCompleted !== true) {
            const {
                currentStep,
                flowObject: {
                    currency,
                    giveData,
                    selectedTaxReceiptProfile,
                    type,
                    groupId,
                    campaignId,
                },
                flowSteps,
                companiesAccountsData,
                donationMatchData,
                giveGroupDetails,
                i18n:{
                    language,
                },
            } = this.props;
            const bannerClass = {
                'donations': 'flowReviewbanner',
                'give/to/charity': 'charityallocationbanner',
                'give/to/friend': 'flowReviewbanner',
                'give/to/group': 'givinggroupbanner',
            };
            const formatMessage = this.props.t;
            let reviewData = {};
            let toURL = `/${type}/${flowSteps[0]}`;
            let isGiveFrom = false;
            if (groupId) {
                toURL = `${toURL}?group_id=${groupId}`;
                isGiveFrom = true;
            } else if(campaignId) {
                toURL = `${toURL}?campaign_id=${campaignId}`;
                isGiveFrom = true;
            }
            if(type === 'donations'){
                reviewData = populateDonationReviewPage(giveData, {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    },
                    currency,
                    formatMessage,
                    language,
                );
            } else if(type === 'give/to/friend'){
                reviewData = populateP2pReviewPage(giveData, {
                        toURL,
                        type,
                    },
                    currency,
                    formatMessage,
                    language,
                );
            } else {
                reviewData = populateGiveReviewPage(giveData, {
                        giveGroupDetails,
                        toURL,
                        type,
                    },
                    currency,
                    formatMessage,
                    language,
                    isGiveFrom,
                );
            }
            const {
                editUrl,
                buttonText,
                headingText,
                isRecurring,
                mainDisplayAmount,
                mainDisplayImage,
                mainDisplayText,
                listingData,
                showP2pList,
            } = reviewData;
            const refundMessage = (isRecurring) ? formatMessage('commonRecurringNonrefundable') : formatMessage('commonNonrefundable');
            return (
                <Fragment>
                    <div className={bannerClass[type]}>
                        <Container>
                            <div className="flowReviewbannerText">
                                <Header as='h2'>{headingText}</Header>
                            </div>
                        </Container>
                    </div>
                    <div className="flowReview">
                        <Container>
                        <Grid centered verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={14} computer={12}>
                            <FlowBreadcrumbs
                                currentStep={currentStep}
                                formatMessage={formatMessage}
                                steps={flowSteps}
                                flowType={type}
                            />
                            </Grid.Column>
                            </Grid.Row>
                            </Grid>
                            {
                                (!!showP2pList) && (
                                    <div className="p2p-top-table">
                                        <Grid centered verticalAlign="middle">
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={14} computer={12}>
                                                    <Grid>
                                                        <Grid.Row>
                                                            <Grid.Column mobile={16} tablet={4} computer={4}>
                                                                <div className="send-table">
                                                                    <b>{formatMessage('reviewP2pSendTo')}</b>
                                                                </div>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={12} computer={12}>
                                                                <Table className="no-border-table">
                                                                    <Table.Body>
                                                                        {this.renderSendingListing(reviewData.recipients)}
                                                                    </Table.Body>
                                                                </Table>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                    <div className="totalAmount dottedBorderline">
                                                        <Grid>
                                                            <Grid.Row className="reviewP2ptext">
                                                                <Grid.Column mobile={8} tablet={8} computer={8} >
                                                                    <div className="">
                                                                    <b>{formatMessage('reviewP2pAmount')}</b>
                                                                    </div>
                                                                </Grid.Column>
                                                                <Grid.Column mobile={8} tablet={8} computer={8} textAlign="right" >
                                                                    <div className="amount-table amount-table_text" textAlign="right">
                                                                        {mainDisplayAmount}
                                                                    </div>
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        </Grid>
                                                    </div>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </div>
                                )
                            }
                            {
                                (!showP2pList) && (
                                    <div className="single-top-table">
                                        <Grid centered verticalAlign="middle">
                                            <Grid.Row>
                                                <Grid.Column mobile={16} tablet={14} computer={12}>
                                                    <div className="GivingGroupIcons">
                                                        <Image src={mainDisplayImage} className="Icon_Profile" centered/>
                                                        <Header as='h2'>
                                                            {mainDisplayAmount}
                                                            <Header.Subheader>
                                                                {mainDisplayText}
                                                            </Header.Subheader>
                                                        </Header>
                                                    </div>
                                                    </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </div>
                                )
                            }
                            <Grid centered verticalAlign="middle">

                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={14} computer={12}>
                                        <div className="GiveTable">
                                            <Table basic='very' className="no_shadow_tbl_mob">
                                                <Table.Body>
                                                    {this.renderListing(listingData)}
                                                </Table.Body>
                                            </Table>
                                            <div className="mob_brdr_btm_none mob_shadow_btm_none btn_border">
                                                <Grid>
                                                    <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={8} computer={9} className="mobile_text">
                                                    {refundMessage}
                                                    </Grid.Column>
                                                    <Grid.Column mobile={16} tablet={8} computer={7} className="mobile_btn">
                                                            <Button
                                                                className="blue-btn-rounded-def w-160 mob_btn_edit width-full-btn"
                                                                primary
                                                                content={(!this.state.buttonClicked)
                                                                    ? buttonText
                                                                    : formatMessage('giveCommon:submittingButton')}
                                                                disabled={(this.state.buttonClicked)}
                                                                onClick={this.handleSubmit}
                                                            />
                                                         <Link route={editUrl}>
                                                                <Button
                                                                    className="blue-bordr-btn-round-def w-120 mob_btn_edit "
                                                                    disabled={(this.state.buttonClicked)}
                                                                >
                                                                    {formatMessage('reviewEdit')}
                                                                </Button>
                                                            </Link>
                                                    </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </div>
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
        companyDetails: state.give.companyData,
    };
}

export default withTranslation(['review', 'giveCommon'])(connect(mapStateToProps)(Review));
