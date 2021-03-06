import React, { useState, Fragment, useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    useDispatch, useSelector,
} from 'react-redux';
import {
    Accordion,
    Grid,
    Icon,
    Menu,
    Responsive,
} from 'semantic-ui-react';

import { Router } from '../../../routes';
import {
    intializeCreateGivingGroup,
    manageGivingGroupAccordianMenuOptions,
    manageGivingGroupAccordianOptions,
} from '../../../helpers/createGrouputils';


const ManageGivingGroupAccordian = ({
    editGivingGroupStoreFlowObject,
    groupId,
    step,
    substep,
    slug,
}) => {
    const dispatch = useDispatch();
    const activeAccordionIndexValue = manageGivingGroupAccordianOptions[step]
        ? manageGivingGroupAccordianOptions[step].value : null;
    const activeMenuIndexValue = manageGivingGroupAccordianMenuOptions[substep]
        ? manageGivingGroupAccordianMenuOptions[substep].value : null;
    const [
        stepState,
        setStepState,
    ] = useState(step);
    const [
        activeAccordionIndex,
        setActiveAccordionIndex,
    ] = useState(activeAccordionIndexValue);
    const [
        activeMenuIndex,
        setActiveMenuIndex,
    ] = useState(activeMenuIndexValue);
    const [
        currentComponentSelectedState,
        setCurrentComponentSelectedState,
    ] = useState({});
    const defaultPageViewStatus = {
        menuView: true,
        pageView: false,
    };
    const pageViewStatus = useSelector((state) => state.createGivingGroup.pageViewStatus || defaultPageViewStatus);
    const updatedMenuIndex = useSelector((state) => state.createGivingGroup.groupManageMenuIndex || {});

    useEffect(() => {
        dispatch({
            payload: {
                pageStatus: {
                    menuView: true,
                    pageView: false,
                },
            },
            type: 'SET_MANAGE_PAGE_STATUS',
        });
    }, []);

    if (_isEmpty(currentComponentSelectedState) && activeMenuIndexValue !== null) {
        setCurrentComponentSelectedState(manageGivingGroupAccordianMenuOptions[substep]);
    } else if (_isEmpty(currentComponentSelectedState) && activeAccordionIndexValue !== null) {
        setCurrentComponentSelectedState(manageGivingGroupAccordianOptions[step]);
    }

    useEffect(() => {
        if (!_isEmpty(updatedMenuIndex) && (activeAccordionIndex !== updatedMenuIndex.index)) {
            setActiveAccordionIndex(updatedMenuIndex.index);
            dispatch({
                payload: {
                    pageStatus: {
                        menuView: false,
                        pageView: true,
                    },
                },
                type: 'SET_MANAGE_PAGE_STATUS',
            });
            setCurrentComponentSelectedState(manageGivingGroupAccordianOptions[updatedMenuIndex.menu]);
            Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[updatedMenuIndex.menu].route}`, { shallow: true });
            dispatch({
                payload: {
                    menuDetails: {},
                },
                type: 'UPDATE_MANAGE_GROUP_MENU_ITEM',
            });
        }
    }, [
        updatedMenuIndex,
    ]);

    const handleAccordionClick = (e, titleProps) => {
        const {
            accordionIndex,
            stepValue,
            showMenu,
        } = titleProps;
        const newAccordionIndex = activeAccordionIndex === accordionIndex ? -1 : accordionIndex;
        setActiveAccordionIndex(newAccordionIndex);
        if (showMenu) {
            dispatch({
                payload: {
                    pageStatus: {
                        menuView: false,
                        pageView: true,
                    },
                },
                type: 'SET_MANAGE_PAGE_STATUS',
            });
        }
        setStepState(stepValue);
        setCurrentComponentSelectedState(manageGivingGroupAccordianOptions[stepValue]);
        Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[stepValue].route}`, { shallow: true });
    };

    const handleMenuItemClick = (e, titleProps) => {
        e.stopPropagation();
        const {
            menuIndex,
            subStepValue,
        } = titleProps;
        const newMenuIndex = activeMenuIndex === menuIndex ? -1 : menuIndex;
        setActiveMenuIndex(newMenuIndex);
        dispatch({
            payload: {
                pageStatus: {
                    menuView: false,
                    pageView: true,
                },
            },
            type: 'SET_MANAGE_PAGE_STATUS',
        });
        setCurrentComponentSelectedState(manageGivingGroupAccordianMenuOptions[subStepValue]);
        Router.pushRoute(`/groups/${slug}/${manageGivingGroupAccordianOptions[stepState].route}/${manageGivingGroupAccordianMenuOptions[subStepValue].route}`, { shallow: true });
    };

    const accordianView = (
        <Accordion as={Menu} fluid vertical tabular>
            <Menu.Item className="itemAccordion" active={activeAccordionIndex === 0}>
                <Accordion.Title
                    accordionIndex={0}
                    stepValue={manageGivingGroupAccordianOptions.edit.key}
                    onClick={handleAccordionClick}
                    showMenu={false}
                >
                    <Icon name="edit" />
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
            <Menu.Item
                className="itemAccordion"
                active={[
                    1,
                    2,
                    3,
                    4,
                ].includes(activeAccordionIndex)}
            >
                <Accordion.Title
                    accordionIndex={1}
                    stepValue={manageGivingGroupAccordianOptions.members.key}
                    onClick={handleAccordionClick}
                    showMenu={false}
                >
                    <Icon name="users" />
                    {manageGivingGroupAccordianOptions.members.text}
                </Accordion.Title>
                <Accordion.Content>
                    <Menu.Item
                        accordionIndex={2}
                        stepValue={manageGivingGroupAccordianOptions.manage.key}
                        active={activeAccordionIndex === manageGivingGroupAccordianOptions.manage.value
                            || activeAccordionIndex === manageGivingGroupAccordianOptions.members.value}
                        onClick={handleAccordionClick}
                        showMenu
                    >
                        {manageGivingGroupAccordianOptions.manage.text}
                    </Menu.Item>
                    <Menu.Item
                        accordionIndex={3}
                        stepValue={manageGivingGroupAccordianOptions.invites.key}
                        active={activeAccordionIndex === manageGivingGroupAccordianOptions.invites.value}
                        onClick={handleAccordionClick}
                        showMenu
                    >
                        {manageGivingGroupAccordianOptions.invites.text}
                    </Menu.Item>
                    <Menu.Item
                        accordionIndex={4}
                        stepValue={manageGivingGroupAccordianOptions.email_members.key}
                        active={activeAccordionIndex === manageGivingGroupAccordianOptions.email_members.value}
                        onClick={handleAccordionClick}
                        showMenu
                    >
                        {manageGivingGroupAccordianOptions.email_members.text}
                    </Menu.Item>
                </Accordion.Content>
            </Menu.Item>
            <Menu.Item
                accordionIndex={5}
                stepValue={manageGivingGroupAccordianOptions.downloaddonation.key}
                active={activeAccordionIndex === manageGivingGroupAccordianOptions.downloaddonation.value}
                onClick={handleAccordionClick}
                showMenu
            >
                <Icon name="donation" />
                {manageGivingGroupAccordianOptions.downloaddonation.text}
            </Menu.Item>
            <Menu.Item
                accordionIndex={6}
                stepValue={manageGivingGroupAccordianOptions.widget.key}
                active={activeAccordionIndex === manageGivingGroupAccordianOptions.widget.value}
                onClick={handleAccordionClick}
                showMenu
            >
                <Icon name="landing" />
                {manageGivingGroupAccordianOptions.widget.text}
            </Menu.Item>
        </Accordion>
    );

    const pagelayout = (
        <div className="createNewGroupWrap manageGroupWrap">
            <div className="mainContent">
                {!_isEmpty(currentComponentSelectedState)
                && React.cloneElement(currentComponentSelectedState.component, {
                    editGivingGroupStoreFlowObject,
                    fromCreate: false,
                    groupId,
                })
                }
            </div>
        </div>
    );
    return (
        <Fragment>
            <Responsive minWidth={768}>
                <Grid className="menuContentWrap">
                    <Grid.Column computer={5} tablet={5} mobile={16}>
                        {accordianView}
                    </Grid.Column>
                    <Grid.Column computer={11} tablet={11} mobile={16} className="active">
                        {pagelayout}
                    </Grid.Column>
                </Grid>
            </Responsive>
            <Responsive minWidth={320} maxWidth={767}>
                <Grid className="menuContentWrap">
                    <Grid.Column tablet={16} mobile={16}>
                        {pageViewStatus.menuView
                        && (
                            <Fragment>
                                {accordianView}
                            </Fragment>
                        )}
                        {pageViewStatus.pageView
                        && (
                            <Fragment>
                                {pagelayout}
                            </Fragment>
                        )}
                    </Grid.Column>
                </Grid>
            </Responsive>
        </Fragment>
    );
};

ManageGivingGroupAccordian.defaultProps = {
    editGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup },
    groupId: '',
    slug: '',
    step: '',
    substep: '',
};

export default ManageGivingGroupAccordian;
