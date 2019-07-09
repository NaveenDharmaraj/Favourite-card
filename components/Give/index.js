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
    console.log('render with props called')
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
        case "tax-receipt" :
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
        if(nextProps.flowObject && !_.isEmpty(nextProps.flowObject.nextStep) && nextProps.flowObject.nextStep!==nextProps.step) {
            console.log(Router.pathname, Router.query, Router.route, Router.asPath);
            const routeUrl = `${nextProps.baseUrl}/${nextProps.flowObject.nextStep}`
            console.log(routeUrl)
            Router.pushRoute(routeUrl);
        }
        // console.log('componentWillUpdate -> ', nextProps);
    }

    componentDidMount() {
        const {
            flowSteps
        } = this.state;
        if(_.indexOf(flowSteps, this.props.step) < 0) {
            // const routeUrl = Router.asPath.replace(/\/[^\/]*$/, `/${flowSteps[0]}`)
            console.log("not able to find step -> ", this.props.step)
            const routeUrl = `${this.props.baseUrl}/${flowSteps[0]}`
            Router.pushRoute(routeUrl);
        }
    }

    render() {
        console.log('props from give wrapper', this.props);
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
        defaultTaxReceiptProfile: state.user.defaultTaxReceiptProfile,
        donationMatchData: state.user.donationMatchData,
        flowObject: state.give.flowObject,
        fund: state.user.fund,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
        // userCampaigns: state.user.userCampaigns,
        // userGroups: state.user.userGroups,
    };
}

export default connect(mapStateToProps)(Give);
