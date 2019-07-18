import {
    arrayOf,
    PropTypes,
    string,
} from 'prop-types';
import {
    Breadcrumb,
} from 'semantic-ui-react';
import React from 'react';
import _ from 'lodash';

/**
 * Wrapper/Generator for a flow's breadcrumbs (ex for making an allocation)
 * @param  {string}    props.currentStep - The route object for the current step.
 * @param  {array}     props.steps - An ordered list of the flow's steps.
 * @param  {array}   props.breadcrumbArray = True is flow is donation
 * @return {JSX} An SUIR BreadcrumbSection component with Breadcrumbs for each
 * step in the flow and a BreadcrumbDivider between each.
 */
const FlowBreadcrumbs = ({
    currentStep,
    steps,
    breadcrumbArray,
}) => {
    const currentStepIndex = _.indexOf(steps, currentStep);
    const stepsCount = steps.length;
    const makeBreadcrumb = (step, i) => {
        if (currentStepIndex !== 1 && i === 1) {
            return null;
        }
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
            const breadcrumb = (
                <Breadcrumb.Section {...props} key={messageKey}>
                    {breadcrumbArray[stepIndex]}
                </Breadcrumb.Section>
            );
            output = stepsCount - 2 !== i
                ? [
                    breadcrumb,
                    (<Breadcrumb.Divider
                        color="black"
                        icon="caret right"
                        key={i}
                    />),
                ]
                : breadcrumb;
        }
        return output;
    };

    return (
        <Breadcrumb size="mini">
            {_.reduce(
                steps,
                (breadcrumbs, step, i) => _.concat(breadcrumbs, makeBreadcrumb(step, i)),
                [],
            )}
        </Breadcrumb>
    );
};
FlowBreadcrumbs.propTypes = {
    breadcrumbArray: arrayOf(PropTypes.element).isRequired,
    currentStep: string.isRequired,
    steps: arrayOf(PropTypes.element).isRequired,
};

export default FlowBreadcrumbs;
