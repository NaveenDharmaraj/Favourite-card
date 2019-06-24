import React, { cloneElement } from 'react';
import {connect} from 'react-redux'
import _ from 'lodash';
import {Router} from '../../routes'


import TaxReceipt from './TaxReceipt'
import Review from './Review'
import Success from './Success'
import Error from './Error'

const flowSteps = ['new', 'tax-receipt', 'review', 'success', 'error']

const renderChildWithProps = (props, stepIndex) => {
    console.log('render with props called')
    switch (props.step) {
        case "new" :
            return (
                <div>
                { cloneElement(props.children, {
                    dispatch: props.dispatch,
                    flowObject: props.flowObject,
                    flowSteps,
                    stepIndex: _.indexOf(flowSteps, props.step)
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
}

class Give extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stepIndex: _.indexOf(flowSteps, props.step) // redirect to first page if it is < 0
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.flowObject && !_.isEmpty(nextProps.flowObject.nextStep) && nextProps.flowObject.nextStep!==nextProps.step) {
            console.log(Router.pathname, Router.query, Router.route, Router.asPath);
            const routeUrl = Router.asPath.replace(/\/[^\/]*$/, `/${nextProps.flowObject.nextStep}`)
            console.log(routeUrl)
            Router.pushRoute(routeUrl);
        }
        console.log('componentWillUpdate -> ', nextProps);
    }

    componentDidMount() {
        if(_.indexOf(flowSteps, this.props.step) < 0 || !this.props.flowObject) {
            const routeUrl = Router.asPath.replace(/\/[^\/]*$/, `/${flowSteps[0]}`)
            Router.pushRoute(routeUrl);
        }
    }

    render() {
        console.log('props from give wrapper', this.props);
        return ( 
            <div>{renderChildWithProps(this.props, this.state.stepIndex)} 
            </div>
        )
    }

}

function mapStateToProps (state) {
    return {
        auth: state.user.auth,
        flowObject: state.give.flowObject
    }
}

export default connect(mapStateToProps)(Give);
