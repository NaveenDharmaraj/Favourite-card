import React, { cloneElement, Fragment } from 'react';
import dynamic from 'next/dynamic';
import {connect} from 'react-redux'
import _ from 'lodash';
import {
    Header,
    Grid,
    Breadcrumb,
} from 'semantic-ui-react';
import {actionTypes} from '../../actions/give';

import {Router} from '../../routes';
const TaxReceipt = dynamic(() => import('./TaxReceipt'));
const Review = dynamic(() => import('./Review'));
const Success = dynamic(() => import('./Success'));
const Error = dynamic(() => import('./Error'));

const flowStepsDefault = ['new', 'tax-receipt-profile', 'review', 'success', 'error']

const renderChildWithProps = (props, stepIndex, flowSteps) => {
    switch (props.step) {
        case flowSteps[0] :
            return (
                <div>
                { cloneElement(props.children, {
                    ...props,
                    flowSteps,
                    dispatch: props.dispatch,
                    flowObject: props.flowObject,
                    flowSteps: flowSteps,
                    stepIndex: _.indexOf(flowSteps, props.step),
                    slug: props.slug,
                }) }
                </div>
            );
        case "tax-receipt-profile" :
            return (<TaxReceipt
                dispatch={props.dispatch}
                flowObject={props.flowObject}
                flowSteps={flowSteps}
                stepIndex={_.indexOf(flowSteps, props.step)}
            />);
        case "review" :
            return (<Review
                dispatch={props.dispatch}
                flowObject={props.flowObject}
                flowSteps={flowSteps}
                stepIndex={_.indexOf(flowSteps, props.step)}
                slug={props.slug}
            />);
        case "success" :
            return (<Success 
                dispatch={props.dispatch}
                flowObject={props.flowObject}
            />);
        case "error" :
            return (<Error />);
        default:
            return null;
    }
};

class Give extends React.Component {
    constructor(props) {
        super(props)
        const parentFlowSteps = (props.flowSteps) ? props.flowSteps : flowStepsDefault
        this.state = {
            flowSteps: parentFlowSteps,
            stepIndex: _.indexOf(parentFlowSteps, props.step) // redirect to first page if it is < 0
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const {
            flowObject,
            dispatch,
        } = nextProps;
        const {
            flowSteps,
        } = this.state;
        if(flowObject && !_.isEmpty(flowObject.nextStep) && flowObject.nextStep!==nextProps.step) {
            if (
                (!_.isEmpty(flowObject.selectedTaxReceiptProfile)
                || (_.isEmpty(flowObject.selectedTaxReceiptProfile)
                    && (flowObject.giveData.creditCard.value === null))
                )
                && flowObject.nextStep === 'tax-receipt-profile'
            ) {
                console.log( flowObject.nextStep);
                return dispatch({
                    payload: {
                        ...flowObject,
                        nextStep: flowSteps[2]
                    },
                    type: actionTypes.SAVE_FLOW_OBJECT,
                });
            }
            const  routeUrl = `${nextProps.baseUrl}/${flowObject.nextStep}`;
            // const routeUrl = `${nextProps.baseUrl}/${nextProps.flowObject.nextStep}`;
            Router.pushRoute(routeUrl);
        }
    }

    componentDidMount() {
        const {
            flowSteps,
        } = this.state;
        if(_.indexOf(flowSteps, this.props.step) < 0) {
            // const routeUrl = Router.asPath.replace(/\/[^\/]*$/, `/${flowSteps[0]}`)
            const routeUrl = `${this.props.baseUrl}/${flowSteps[0]}`
            Router.pushRoute(routeUrl);
        }
    }

    render() {
        return (
            <Fragment>
                <div className="pageHeader">
                    <Grid columns={2} verticalAlign='middle'>
                        <Grid.Row>
                        <Grid.Column >
                            <Header as='h2'>Review</Header>
                        </Grid.Column>
                        <Grid.Column >
                            <Breadcrumb floated='right'>
                            <Breadcrumb.Section link>Give</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='triangle right' />
                            <Breadcrumb.Section link>Review</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='triangle right' />
                            <Breadcrumb.Section active>Confirmation</Breadcrumb.Section>
                            </Breadcrumb>
                        </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    </div>
                    
                {renderChildWithProps(this.props, this.state.stepIndex, this.state.flowSteps)}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.user.auth,
        companiesAccountsData: state.user.companiesAccountsData,
        currentUser: state.user.currentUser,
        defaultTaxReceiptProfile: state.user.defaultTaxReceiptProfile,
        donationMatchData: state.user.donationMatchData,
        flowObject: state.give.flowObject,
        fund: state.user.fund,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
    };
}

export default connect(mapStateToProps)(Give);
