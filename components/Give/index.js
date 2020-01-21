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
import FlowBreadcrumbs from './FlowBreadcrumbs';
import { withTranslation } from '../../i18n';
import {Router} from '../../routes';
// const TaxReceipt = dynamic(() => import('./TaxReceipt'));
const Review = dynamic(() => import('./Review'));
const Success = dynamic(() => import('./Success'));
const Error = dynamic(() => import('./Error'));

const flowStepsDefault = ['new', 'review', 'success', 'error']

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
        case "review" :
            if(!_.isEmpty(props.flowObject)){
                return (<Review
                    dispatch={props.dispatch}
                    flowObject={props.flowObject}
                    flowSteps={flowSteps}
                    stepIndex={_.indexOf(flowSteps, props.step)}
                    slug={props.slug}
                />);
            }
            else{
                Router.pushRoute('/dashboard');
                break;
            }
        case "success" :
            if(!_.isEmpty(props.flowObject)){
                return (<Success 
                    dispatch={props.dispatch}
                    flowObject={props.flowObject}
                />);
            }
            else{
                Router.pushRoute('/dashboard');
                break;
            }
        case "error" :
            return (<Error 
                dispatch={props.dispatch}
                flowObject={props.flowObject}
                />);
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
            const  routeUrl = `${nextProps.baseUrl}/${flowObject.nextStep}`;
            Router.pushRoute(routeUrl);
        }
    }

    componentDidMount() {
        const {
            flowSteps,
        } = this.state;
        if(_.indexOf(flowSteps, this.props.step) < 0) {
            const routeUrl = `${this.props.baseUrl}/${flowSteps[0]}`
            Router.pushRoute(routeUrl);
        }
    }

    render() {
        const {
            baseUrl,
            step,
        } = this.props;
        const {
            flowSteps,
        } = this.state;
        const formatMessage = this.props.t;
        const breadcrumbArray = [
            (baseUrl === '/donations') ? formatMessage('breadCrumb.new') : formatMessage('breadCrumb.give'),
            formatMessage('breadCrumb.review'),
            formatMessage('breadCrumb.success'),
        ]
        return (
            <Fragment>
                <div className="pageHeader">
                    <Grid columns={2} verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column >
                                {(step !== 'error') &&
                                    <Header as='h2'>
                                        {breadcrumbArray[_.indexOf(flowSteps, step)]}
                                    </Header>
                                }
                            </Grid.Column>
                            <Grid.Column >
                                <FlowBreadcrumbs
                                    currentStep={step}
                                    formatMessage={formatMessage}
                                    steps={flowSteps}
                                    breadcrumbArray={breadcrumbArray}

                                />
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

export default withTranslation('giveCommon')(connect(mapStateToProps)(Give));
