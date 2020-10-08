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
    Button,
    Popup,
    Icon,
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
            groupMatchingDetails,
        } = this.props
        if (flowObject) {
            reInitNextStep(dispatch, flowObject)
        }
        if(flowObject && flowObject.stepsCompleted){
            Router.pushRoute('/dashboard');
        }
        const {
            giveData: {
                giveAmount,
                giveTo,
                giveFrom,
                matchingPolicyDetails,
            }
        } = flowObject;
        if(giveTo.type === 'groups' && matchingPolicyDetails.isValidMatchPolicy) {
                    dispatch(fetchGroupMatchAmount(giveAmount, giveFrom.value, giveTo.value));
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
                                <Table.Row data-test="Give_Review_transaction_details">
                                    <Table.Cell className="tableOne" >{formatMessage(data.name)}</Table.Cell>
                                    <Table.Cell className="tabletwo" >{ data.value}</Table.Cell>
                                    <Table.Cell className="tablethree"></Table.Cell>
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
                                <Table.Cell textAlign='right'>{data.amount}</Table.Cell>
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
                currentUser,
                flowObject: {
                    currency,
                    giveData,
                    selectedTaxReceiptProfile,
                    type,
                    groupId,
                    groupCampaignId,
                    campaignId,
                },
                flowSteps,
                companiesAccountsData,
                donationMatchData,
                giveGroupDetails,
                groupMatchingDetails,
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
            const displayName = (currentUser.attributes.displayName)
                ? currentUser.attributes.displayName
                : currentUser.attributes.firstName;
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
            } else if(groupCampaignId) {
                toURL = `${toURL}?groupCampaign_id=${groupCampaignId}`;
                isGiveFrom = true;
            }

            if(type === 'donations'){
                reviewData = populateDonationReviewPage(giveData, {
                        companiesAccountsData,
                        donationMatchData,
                        selectedTaxReceiptProfile,
                    },
                    displayName,
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
                        groupMatchingDetails,
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
                isGroupWithMatching,
                isRecurring,
                mainDisplayAmount,
                mainDisplayImage,
                mainDisplayText,
                listingData,
                toDetailsForMatching,
                showP2pList,
            } = reviewData;
            const refundMessage = (isRecurring) ? formatMessage('commonRecurringNonrefundable') : formatMessage('commonNonrefundable');
            return (
                <Fragment>
                    <div className={bannerClass[type]} data-test="Give_Review_banner">
                        <Container>
                            <div className="flowReviewbannerText">
                                <Header as='h2' data-test="Give_Review_banner_text">{headingText}</Header>
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
                                    <div className="p2p-top-table" data-test="Give_Review_P2P_amount_details">
                                        <Grid centered verticalAlign="middle">
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={14} computer={12}>
                                                    <Grid>
                                                        <Grid.Row>
                                                            <Grid.Column mobile={16} tablet={4} computer={4}>
                                                                <div className="send-table">
                                                                    {formatMessage('reviewP2pSendTo')}
                                                                </div>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={12} computer={12}>
                                                                <Table className="no-border-table unstackable">
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
                                                                    <div className="send-table">
                                                                    {formatMessage('reviewP2pAmount')}
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
                                    <div className="single-top-table" data-test="Give_Review_amount_details">
                                        <Grid centered verticalAlign="middle">
                                            <Grid.Row>
                                                <Grid.Column mobile={16} tablet={14} computer={12}>
                                                    <div className="GivingGroupIcons">
                                                        <Image src={mainDisplayImage} className="Icon_Profile" centered/>
                                                        <Header as='h2'>
                                                            {(!isGroupWithMatching) && (mainDisplayAmount) }
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
                                        {(!!isGroupWithMatching) && (
                                            <div className="review-top-table">
                                                <Table unstackable basic='very' className="no-border-table layoutfixed">
                                                    <Table.Body>
                                                        <Table.Row verticalAlign='top'>
                                                            <Table.Cell>
                                                                {toDetailsForMatching.heading}
                                                                <div className="note">
                                                                {toDetailsForMatching.subHeading}
                                                                </div>
                                                            </Table.Cell>
                                                            <Table.Cell textAlign='right'>{mainDisplayAmount}</Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row verticalAlign='top'>
                                                            <Table.Cell>
                                                                <div className='matchingAmount'>
                                                                    <span>{toDetailsForMatching.matchingHeading}</span>
                                                                    <Popup
                                                                        content={toDetailsForMatching.popUpMessage}
                                                                        position="bottom right"
                                                                        className="matching-popup"
                                                                        inverted
                                                                        trigger={(
                                                                            <Icon
                                                                                color="blue"
                                                                                name="question circle"
                                                                                size="large"
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>
                                                                {
                                                                    (toDetailsForMatching.subHeading !== '') && (
                                                                        <div className="note">
                                                                            {toDetailsForMatching.matchingSubHeading}
                                                                        </div>
                                                                    )
                                                                }

                                                            </Table.Cell>
                                                            <Table.Cell textAlign='right'>{toDetailsForMatching.matchingAmount}</Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                    <Table.Footer fullWidth>
                                                        <Table.Row verticalAlign='top'>
                                                            <Table.Cell>
                                                                {toDetailsForMatching.totalHeading}
                                                            </Table.Cell>
                                                            <Table.Cell textAlign='right'>{toDetailsForMatching.totalAmount}</Table.Cell>
                                                        </Table.Row>
                                                    </Table.Footer>
                                                </Table>
                                            </div>
                                        ) }
                                        <div className="GiveTable">
                                            <Table basic='very' className="no_shadow_tbl_mob">
                                                <Table.Body>
                                                    {this.renderListing(listingData)}
                                                </Table.Body>
                                            </Table>
                                            <div className="mob_brdr_btm_none mob_shadow_btm_none btn_border">
                                                <Grid>
                                                    <Grid.Row>
                                                    <Grid.Column data-test="Give_Review_refund_text" mobile={16} tablet={6} computer={8} className="mobile_text">
                                                    {refundMessage}
                                                    </Grid.Column>
                                                    <Grid.Column mobile={16} tablet={10} computer={8}>
                                                        <div className="mobile_btn">                                                      
                                                         <Link route={editUrl}>
                                                                <Button
                                                                    className="blue-bordr-btn-round-def mb-1 w-120 "
                                                                    disabled={(this.state.buttonClicked)}
                                                                    data-test="Give_Review_edit_button"
                                                                >
                                                                    {formatMessage('reviewEdit')}
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                className="blue-btn-rounded-def w-160 mb-1  width-full-btn"
                                                                data-test="Give_Review_submit_button"
                                                                primary
                                                                content={(!this.state.buttonClicked)
                                                                    ? buttonText
                                                                    : formatMessage('giveCommon:submittingButton')}
                                                                disabled={(this.state.buttonClicked)}
                                                                onClick={this.handleSubmit}
                                                            />
                                                            </div>
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
        groupMatchingDetails: state.give.groupMatchingDetails,
    };
}

const connectedComponent = withTranslation(['review', 'giveCommon'])(connect(mapStateToProps)(Review));
export {
    connectedComponent as default,
    Review,
    mapStateToProps,
}
