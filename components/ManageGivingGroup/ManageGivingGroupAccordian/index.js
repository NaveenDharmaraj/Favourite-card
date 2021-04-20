
import { useState } from "react";
import _isEmpty from 'lodash/isEmpty';
import { Accordion, Grid, Icon, Menu } from "semantic-ui-react";

import { Router } from '../../../routes';
import { intializeCreateGivingGroup, manageGivingGroupAccordianMenuOptions, manageGivingGroupAccordianOptions } from '../../../helpers/createGrouputils';


const ManageGivingGroupAccordian = ({ editGivingGroupStoreFlowObject, groupId, step, substep, slug }) => {
    const activeAccordionIndexValue = manageGivingGroupAccordianOptions[step] ? manageGivingGroupAccordianOptions[step].value : null;
    const activeMenuIndexValue = manageGivingGroupAccordianMenuOptions[substep] ? manageGivingGroupAccordianMenuOptions[substep].value : null;
    const [stepState, setStepState] = useState(step);
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(activeAccordionIndexValue);
    const [activeMenuIndex, setActiveMenuIndex] = useState(activeMenuIndexValue);
    const [currentComponentSelectedState, setCurrentComponentSelectedState] = useState({});
    if (_isEmpty(currentComponentSelectedState) && activeMenuIndexValue !== null) {
        setCurrentComponentSelectedState(manageGivingGroupAccordianMenuOptions[substep]);
    } else if (_isEmpty(currentComponentSelectedState) && activeAccordionIndexValue !== null) {
        setCurrentComponentSelectedState(manageGivingGroupAccordianOptions[step]);
    }
    const handleAccordionClick = (e, titleProps) => {
        const { accordionIndex, stepValue } = titleProps
        const newAccordionIndex = activeAccordionIndex === accordionIndex ? -1 : accordionIndex
        setActiveAccordionIndex(newAccordionIndex);
        setStepState(stepValue);
        setCurrentComponentSelectedState(manageGivingGroupAccordianOptions[stepValue]);
        Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[stepValue].route}`, { shallow: true });
    }

    const handleMenuItemClick = (e, titleProps) => {
        e.stopPropagation();
        const { menuIndex, subStepValue } = titleProps
        const newMenuIndex = activeMenuIndex === menuIndex ? -1 : menuIndex;
        setActiveMenuIndex(newMenuIndex);
        setCurrentComponentSelectedState(manageGivingGroupAccordianMenuOptions[subStepValue]);
        Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[stepState].route}/${manageGivingGroupAccordianMenuOptions[subStepValue].route}`, { shallow: true })
    };
    return (
        <Grid className='menuContentWrap'>
            <Grid.Column computer={5} tablet={5} mobile={16}>
                <Accordion as={Menu} fluid vertical tabular>
                    <Menu.Item className='itemAccordion' active={activeAccordionIndex === 0}>
                        <Accordion.Title
                            accordionIndex={0}
                            stepValue={manageGivingGroupAccordianOptions.edit.key}
                            onClick={handleAccordionClick}
                        >
                            <Icon name='edit' />
                            {manageGivingGroupAccordianOptions.edit.text}
                        </Accordion.Title>
                        <Accordion.Content>
                            <Menu.Item
                                menuIndex={0}
                                subStepValue={manageGivingGroupAccordianMenuOptions.basic.key}
                                active={(activeMenuIndex === manageGivingGroupAccordianMenuOptions.basic.value)
                                    || (activeMenuIndex === null && activeAccordionIndex === 0)}
                                onClick={handleMenuItemClick}
                            >
                                {manageGivingGroupAccordianMenuOptions.basic.text}
                            </Menu.Item>
                            <Menu.Item
                                menuIndex={1}
                                subStepValue={manageGivingGroupAccordianMenuOptions.about.key}
                                active={activeMenuIndex === manageGivingGroupAccordianMenuOptions.about.value}
                                onClick={handleMenuItemClick}
                            >
                                {manageGivingGroupAccordianMenuOptions.about.text}
                            </Menu.Item>
                            <Menu.Item
                                menuIndex={2}
                                subStepValue={manageGivingGroupAccordianMenuOptions.picsvideos.key}
                                active={activeMenuIndex === manageGivingGroupAccordianMenuOptions.picsvideos.value}
                                onClick={handleMenuItemClick}
                            >
                                {manageGivingGroupAccordianMenuOptions.picsvideos.text}
                            </Menu.Item>
                            <Menu.Item
                                menuIndex={3}
                                subStepValue={manageGivingGroupAccordianMenuOptions.givinggoals.key}
                                active={activeMenuIndex === manageGivingGroupAccordianMenuOptions.givinggoals.value}
                                onClick={handleMenuItemClick}
                            >
                                {manageGivingGroupAccordianMenuOptions.givinggoals.text}
                            </Menu.Item>
                            <Menu.Item
                                menuIndex={4}
                                subStepValue={manageGivingGroupAccordianMenuOptions.monthlygifts.key}
                                active={activeMenuIndex === manageGivingGroupAccordianMenuOptions.monthlygifts.value}
                                onClick={handleMenuItemClick}
                            >
                                {manageGivingGroupAccordianMenuOptions.monthlygifts.text}
                            </Menu.Item>
                            <Menu.Item
                                menuIndex={5}
                                subStepValue={manageGivingGroupAccordianMenuOptions.charitysupport.key}
                                active={activeMenuIndex === manageGivingGroupAccordianMenuOptions.charitysupport.value}
                                onClick={handleMenuItemClick}
                            >
                                {manageGivingGroupAccordianMenuOptions.charitysupport.text}
                            </Menu.Item>
                        </Accordion.Content>
                    </Menu.Item>
                    <Menu.Item className='itemAccordion' active={[1, 2, 3, 4].includes(activeAccordionIndex)}>
                        <Accordion.Title
                            accordionIndex={1}
                            stepValue={manageGivingGroupAccordianOptions.members.key}
                            onClick={handleAccordionClick}
                        >
                            <Icon name='users' />
                            {manageGivingGroupAccordianOptions.members.text}
                        </Accordion.Title>
                        <Accordion.Content>
                            <Menu.Item
                                accordionIndex={2}
                                stepValue={manageGivingGroupAccordianOptions.manage.key}
                                active={activeAccordionIndex === manageGivingGroupAccordianOptions.manage.value
                                    || activeAccordionIndex === manageGivingGroupAccordianOptions.members.value}
                                onClick={handleAccordionClick}
                            >
                                {manageGivingGroupAccordianOptions.manage.text}
                            </Menu.Item>
                            <Menu.Item
                                accordionIndex={3}
                                stepValue={manageGivingGroupAccordianOptions.invites.key}
                                active={activeAccordionIndex === manageGivingGroupAccordianOptions.invites.value}
                                onClick={handleAccordionClick}
                            >
                                {manageGivingGroupAccordianOptions.invites.text}
                            </Menu.Item>
                            <Menu.Item
                                accordionIndex={4}
                                stepValue={manageGivingGroupAccordianOptions['email_members'].key}
                                active={activeAccordionIndex === manageGivingGroupAccordianOptions['email_members'].value}
                                onClick={handleAccordionClick}
                            >
                                {manageGivingGroupAccordianOptions['email_members'].text}
                            </Menu.Item>
                        </Accordion.Content>
                    </Menu.Item>
                    <Menu.Item
                        accordionIndex={5}
                        stepValue={manageGivingGroupAccordianOptions.downloaddoantion.key}
                        active={activeAccordionIndex === manageGivingGroupAccordianOptions.downloaddoantion.value}
                        onClick={handleAccordionClick}
                    >
                        <Icon name='donation' />
                        {manageGivingGroupAccordianOptions.downloaddoantion.text}
                    </Menu.Item>
                    <Menu.Item
                        accordionIndex={6}
                        stepValue={manageGivingGroupAccordianOptions.widget.key}
                        active={activeAccordionIndex === manageGivingGroupAccordianOptions.widget.value}
                        onClick={handleAccordionClick}
                    >
                        <Icon name='landing' />
                        {manageGivingGroupAccordianOptions.widget.text}
                    </Menu.Item>
                </Accordion>
            </Grid.Column>
            <Grid.Column computer={11} tablet={11} mobile={16} className='active'>
                <div className='createNewGroupWrap manageGroupWrap'>
                    <div className='mainContent'>
                        {!_isEmpty(currentComponentSelectedState) &&
                            React.cloneElement(currentComponentSelectedState.component, { editGivingGroupStoreFlowObject, fromCreate: false, groupId })
                        }
                    </div>
                </div>
            </Grid.Column>
        </Grid>
    )
};

ManageGivingGroupAccordian.defaultProps = {
    editGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup },
    groupId: '',
    step: '',
    substep: '',
    slug: '',
};

export default ManageGivingGroupAccordian;