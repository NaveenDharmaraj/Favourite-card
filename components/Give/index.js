import React, { cloneElement } from 'react';
import dynamic from 'next/dynamic';
import {connect} from 'react-redux'
import _ from 'lodash';

import {Router} from '../../routes';
const TaxReceipt = dynamic(() => import('./TaxReceipt'));
const Review = dynamic(() => import('./Review'));
const Success = dynamic(() => import('./Success'));
const Error = dynamic(() => import('./Error'));

const flowStepsDefault = ['new', 'tax-receipt', 'review', 'success', 'error']

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
            break;
        case "tax-receipt" :
            return (<TaxReceipt
                dispatch={props.dispatch}
                flowObject={props.flowObject}
                flowSteps={flowSteps}
                stepIndex={_.indexOf(flowSteps, props.step)}
            />);
            break;
        case "review" :
            return (<Review
                dispatch={props.dispatch}
                flowObject={props.flowObject}
                flowSteps={flowSteps}
                stepIndex={_.indexOf(flowSteps, props.step)}
                slug={props.slug}
            />);
            break;
        case "success" :
            return (<Success />);
            break;
        case "error" :
            return (<Error />);
            break;
        default:
            return null;
            break;
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
        if(nextProps.flowObject && !_.isEmpty(nextProps.flowObject.nextStep) && nextProps.flowObject.nextStep!==nextProps.step) {
            const routeUrl = `${nextProps.baseUrl}/${nextProps.flowObject.nextStep}`
            Router.pushRoute(routeUrl);
        }
    }

    componentDidMount() {
        const {
            flowSteps
        } = this.state;
        if(_.indexOf(flowSteps, this.props.step) < 0) {
            // const routeUrl = Router.asPath.replace(/\/[^\/]*$/, `/${flowSteps[0]}`)
            const routeUrl = `${this.props.baseUrl}/${flowSteps[0]}`
            Router.pushRoute(routeUrl);
        }
    }

    render() {
        return ( 
            <div>{renderChildWithProps(this.props, this.state.stepIndex, this.state.flowSteps)}
            </div>
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
        giveCharityDetails: state.give.charityDetails,
        giveGroupBenificairyDetails: state.give.benificiaryForGroupDetails,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
    };
}

export default connect(mapStateToProps)(Give);
