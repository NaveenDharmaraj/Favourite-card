import {
    arrayOf,
    PropTypes,
    string,
} from 'prop-types';
import {
    Breadcrumb,
    Grid,
} from 'semantic-ui-react';
import React from 'react';
import _ from 'lodash';

/**
 * Wrapper/Generator for a flow's breadcrumbs (ex for making an allocation)
 * @param  {string}    props.currentStep - The route object for the current step.
 * @param  {array}     props.steps - An ordered list of the flow's steps.
 * @param  {string}   props.flowStep = Type of the flow
 * @return {JSX} An SUIR BreadcrumbSection component with Breadcrumbs for each
 * step in the flow and a BreadcrumbDivider between each.
 */
const FlowBreadcrumbs = ({
    currentStep,
    formatMessage,
    steps,
    flowType,
}) => {
    const breadcrumbArray = [
        (flowType === 'donations') ? formatMessage('giveCommon:breadCrumb.new') : formatMessage('giveCommon:breadCrumb.give'),
        formatMessage('giveCommon:breadCrumb.review'),
        formatMessage('giveCommon:breadCrumb.success'),
    ]
    const currentStepIndex = _.indexOf(steps, currentStep);
    const stepsCount = steps.length;
    const makeBreadcrumb = (step, i) => {
        const messageKey = step;
        const props = {};
        let output = null;
        if (i < (stepsCount - 1)) {
            const stepIndex = _.indexOf(steps, step);
            if (currentStepIndex === stepIndex) {
                props.active = true;
            } else if (currentStepIndex === (stepsCount - 1) && i === (stepsCount - 2)) {
                props.active = true;
            }
            if (currentStepIndex > stepIndex) {
                props.className = 'completed_step';
            }
            const breadcrumb = (
                <Breadcrumb.Section {...props} key={messageKey}>
                    {breadcrumbArray[stepIndex]}
                </Breadcrumb.Section>
            );
            output = stepsCount - 2 !== i
                ? [
                    breadcrumb,
                    (<Breadcrumb.Divider
                        icon='right chevron'
                        key={i}
                    />),
                ]
                : breadcrumb;
        }
        return output;
    };

    return (
        <Grid centered verticalAlign="middle">
            <Grid.Row>
                    <Grid.Column mobile={16} tablet={14} computer={16}>
                            <div className="flowBreadcrumb flowPadding">
                                <Breadcrumb size="mini">
                                    {_.reduce(
                                        steps,
                                        (breadcrumbs, step, i) => _.concat(breadcrumbs, makeBreadcrumb(step, i)),
                                        [],
                                    )}
                                </Breadcrumb>
                            </div>
                    </Grid.Column>
            </Grid.Row>
    </Grid>
       
    );
};
FlowBreadcrumbs.propTypes = {
    breadcrumbArray: arrayOf(string).isRequired,
    currentStep: string.isRequired,
    steps: arrayOf(string).isRequired,
};

export default FlowBreadcrumbs;
