import dynamic from 'next/dynamic';

// const BasicSetting = dynamic(() => import('../basic'));
// const AboutGroup = dynamic(() => import('../about'));
// const PicsVideo = dynamic(() => import('../pics-video'));
// const monthlygifts = dynamic(() => import('../basic'));
// const GivingGoal = dynamic(() => import('../basic'));
// const DownloadTransaction = dynamic(() => import('../downloadTransaction'));
// const AddDonation = dynamic(() => import('../addDonation'));
// const Manage = dynamic(() => import('../basic'));
// const Invite = dynamic(() => import('../basic'));
// const InviteFriends = dynamic(() => import('../basic'));

import { useState } from "react";
import { Accordion, Grid, Icon, Menu } from "semantic-ui-react";
import { Router } from '../../../routes';

const manageGivingGroupAccordianMenuOptions = {
    basic: {
        key: 'basic',
        route: 'basic',
        text: 'Basic Settings',
        value: 0,
        // component: <BasicSetting />
    },
    about: {
        key: 'about',
        route: 'about',
        text: 'About the group',
        value: 1,
        // component: <AboutGroup />
    },
    picsvideos: {
        key: 'picsvideos',
        route: 'picsvideos',
        text: 'Pics & video',
        value: 2,
        // component: <PicsVideo />
    },
    givinggoals: {
        key: 'givinggoals',
        route: 'givinggoals',
        text: 'Giving goal',
        value: 3,
        // component: <GivingGoal />
    },
    monthlygifts: {
        key: 'monthlygifts',
        route: 'monthlygifts',
        text: 'Monthly gifts',
        value: 4,
        // component: <monthlygifts />
    },
    charitysupport: {
        key: 'charitysupport',
        route: 'charitysupport',
        text: 'Charities to support',
        value: 5,
        // component: <BasicSetting />
    },
};
const manageGivingGroupAccordianOptions = {
    edit: {
        key: 'edit',
        route: 'edit',
        text: 'Edit',
        value: 0,
        // component: <BasicSetting />
    },
    members: {
        key: 'members',
        route: 'members',
        text: 'Members',
        value: 1,
        // component: <BasicSetting />
    },
    manage: {
        key: 'manage',
        route: 'manage',
        text: 'Manage',
        value: 2,
        // component: <Manage />
    },
    invites: {
        key: 'invites',
        route: 'invites',
        text: 'Invite',
        value: 3,
        // component: <InviteFriends />
    },
    ['email_members']: {
        key: 'email_members',
        route: 'email_members',
        text: 'Email members',
        value: 4,
        // component: <Invite />
    },
    downloaddoantion: {
        key: 'downloaddoantion',
        route: 'downloaddoantion',
        text: 'Download transaction data',
        value: 5,
        // component: <DownloadTransaction />
    },
    widget: {
        key: 'widget',
        route: 'widget',
        text: 'Add donation button',
        value: 6,
        // component: <AddDonation />
    },
};
const ManageGivingGroupAccordian = ({ step, substep, slug }) => {
    const activeAccordionIndexValue = manageGivingGroupAccordianOptions[step] ? manageGivingGroupAccordianOptions[step].value : null;
    const activeMenuIndexValue = manageGivingGroupAccordianMenuOptions[substep] ? manageGivingGroupAccordianMenuOptions[substep].value : null;
    const [stepState, setStepState] = useState(step);
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(activeAccordionIndexValue);
    const [activeMenuIndex, setActiveMenuIndex] = useState(activeMenuIndexValue);
    const handleAccordionClick = (e, titleProps) => {
        const { accordionIndex, stepValue } = titleProps
        const newAccordionIndex = activeAccordionIndex === accordionIndex ? -1 : accordionIndex
        setActiveAccordionIndex(newAccordionIndex);
        setStepState(stepValue);
        Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[stepValue].route}`, { shallow: true });
    }

    const handleMenuItemClick = (e, titleProps) => {
        const { menuIndex, subStepValue } = titleProps
        const newMenuIndex = activeMenuIndex === menuIndex ? -1 : menuIndex;
        setActiveMenuIndex(newMenuIndex);
        Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[stepState].route}/${manageGivingGroupAccordianMenuOptions[subStepValue].route}`, { shallow: true })
    }
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
                                active={activeMenuIndex === manageGivingGroupAccordianMenuOptions.basic.value}
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
                        {/* <BasicSetting/> */}
                        {/* <AboutGroup/> */}
                        {/* <PicsVideo/> */}
                        {/* <monthlygifts/> */}
                        {/* <CharitiesToSupport/> */}
                        {/* <GivingGoal/> */}
                        {/* {<DownloadTransaction/>} */}
                        {/* {<AddDonation/>} */}
                        {/* {<EmailMembers/>} */}
                        {/* {<Manage/>} */}
                        {/* {<Invite/>} */}
                        {/* { <InviteFriends/>} */}
                    </div>
                </div>
            </Grid.Column>
        </Grid>
    )
};

ManageGivingGroupAccordian.defaultProps = {
    step: '',
    substep: '',
    slug: ''
};

export default ManageGivingGroupAccordian;