import React from 'react';
import {
    Container,
    Header,
    Button,
    Form,
    TextArea,
    Icon,
    Responsive,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import arrayMove from 'array-move';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import {
    aboutDescriptionLimit,
    createGivingGroupBreadCrum,
    createGivingGroupFlowSteps,
    generateBreadCrum,
    initializeAddSectionModalObject,
    intializeCreateGivingGroup,
    isValidText,
} from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import CreateGivingGroupAddSectionModal from '../CreateGivingGroupAddSectionModal';
import { editGivingGroupApiCall, updateCreateGivingGroupObj } from '../../../actions/createGivingGroup';
import { withTranslation } from '../../../i18n';
import CreateGivingGroupHeader from '../CreateGivingGroupHeader';
import EditGivingGroupDescriptionModal from '../EditGivingGroupDescriptionModal';

const SortableList = dynamic(() => import('../../shared/DragAndDropComponent'), { ssr: false });

let breakCrumArray;
const currentActiveStepCompleted = [1, 2];

class CreateGivingGroupAbout extends React.Component {
    constructor(props) {
        super(props);
        const cloneEditGivingGroupObject = _cloneDeep(props.editGivingGroupStoreFlowObject);
        this.state = {
            addModalSectionObject: initializeAddSectionModalObject,
            disableContinue: !_isEmpty((props.createGivingGroupStoreFlowObject)
                && props.createGivingGroupStoreFlowObject.attributes
                && props.createGivingGroupStoreFlowObject.attributes.short) ? false : true,
            showModal: false,
            createGivingGroupObjectState: props.fromCreate ? props.createGivingGroupStoreFlowObject : cloneEditGivingGroupObject,
            doesDescriptionPresent: true,
            isEdit: false,
            isWhiteSpace: true,
        }
        breakCrumArray = createGivingGroupBreadCrum(props.t);
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ createGivingGroupObjectState }) => ({
            createGivingGroupObjectState: {
                ...createGivingGroupObjectState,
                groupPurposeDescriptions: arrayMove(createGivingGroupObjectState.groupPurposeDescriptions, oldIndex, newIndex),
            }
        }), () => {
            //callback function which passes the updated state value to edit GivingGroupApiCall
            if (!this.props.fromCreate) {
                const {
                    dispatch,
                    groupId,
                } = this.props;
                const tempArr = [];
                if (!_isEmpty(this.state.createGivingGroupObjectState.groupPurposeDescriptions)) {
                    this.state.createGivingGroupObjectState.groupPurposeDescriptions.map((desc) => {
                    let tempObj = {};
                    tempObj.description = desc.description;
                    tempObj.purpose = desc.purpose;
                    tempArr.push(tempObj);
                    });
                }
                const editObject = {
                    attributes: {},
                    groupPurposeDescriptions: tempArr,
                };
                dispatch(editGivingGroupApiCall(editObject, groupId));
            }
        }
        );

    };

    handleOnChange = (event, data) => {
        let {
            name,
            value,
        } = data || event.target;
        const {
            createGivingGroupObjectState
        } = this.state;
        if (isValidText(value)) {
            this.setState({
                createGivingGroupObjectState: {
                    ...createGivingGroupObjectState,
                    attributes: {
                        ...createGivingGroupObjectState.attributes,
                        [name]: value,
                    }
                },
                disableContinue: false,
                doesDescriptionPresent: true,
            });
        }
    };

    handleOnBlur = (event, data) => {
        let {
            value,
        } = data || event.target;
        let modofiedValue = '';
        if (value) {
            modofiedValue =  value.trim();
        }
        this.setState({
            doesDescriptionPresent: value ? true : false,
            isWhiteSpace: !(!modofiedValue || modofiedValue.length === 0)
        });
    };

    handleParentModalClick = (modalState, addSectionObject = {}) => {
        const {
            createGivingGroupObjectState: {
                groupPurposeDescriptions,
            },
            addModalSectionObject,
        } = this.state;
        const {
            dispatch,
            fromCreate,
            groupId,
        } = this.props;
        const tempArr = [];
        const tempAboutArr = [];
        if (!_isEmpty(addSectionObject)) {
            let index;
            groupPurposeDescriptions.find((item, i) => {
                if (item.id === addModalSectionObject.id) {
                    index = i;
                    return;
                }
            });
            Number(index) >= 0 ? groupPurposeDescriptions.splice(index, 1, addSectionObject) :
            tempAboutArr.push(
                    { ...addSectionObject, id: `${addSectionObject.purpose}${groupPurposeDescriptions.length}` }
                );
            this.setState({
                createGivingGroupObjectState: {
                    ...this.state.createGivingGroupObjectState,
                    groupPurposeDescriptions: [...groupPurposeDescriptions, ...tempAboutArr],
                },
                showModal: modalState,
                isEdit: false,
            });
            if (!_isEmpty(groupPurposeDescriptions)) {
                groupPurposeDescriptions.map((desc) => {
                    let tempObj = {};
                    tempObj.description = desc.description;
                    tempObj.purpose = desc.purpose;
                    tempArr.push(tempObj);
                });
                if (!fromCreate) {
                    let tempObj = {};
                    tempObj.description = addSectionObject.description;
                    tempObj.purpose = addSectionObject.purpose;
                    tempArr.push(tempObj);
                }
            }
            if (!fromCreate) {
                const editObject = {
                    attributes: {},
                    groupPurposeDescriptions: [...tempArr],
                };
                dispatch(editGivingGroupApiCall(editObject, groupId))
                    .then(() => {
                        this.setState({
                            showModal: false,
                        })
                    })
                    .catch(() => {
                        //handle error
                    })
            }
        } else {
            this.setState({
                addModalSectionObject: initializeAddSectionModalObject,
                showModal: modalState,
                isEdit: false,
            })
        }
    };
    handleOnSortableItemClick = (modalState, currentSelectedCard = initializeAddSectionModalObject) => {
        this.setState({
            addModalSectionObject: currentSelectedCard,
            showModal: modalState,
            isEdit: true,
        });
    };
    handleOnSortableItemDelete = (event, addSectionObject = {}) => {
        event.stopPropagation();
        const {
            createGivingGroupObjectState: {
                groupPurposeDescriptions,
            },
        } = this.state;
        const {
            dispatch,
            fromCreate,
            groupId,
        } = this.props;
        const tempArr = [];
        if (!_isEmpty(addSectionObject)) {
            let index;
            groupPurposeDescriptions.find((item, i) => {
                if (item.id && (item.id === addSectionObject.id)) {
                    index = i;
                    return;
                }
            });
            if (Number(index) >= 0) { groupPurposeDescriptions.splice(index, 1) }
            this.setState({
                createGivingGroupObjectState: {
                    ...this.state.createGivingGroupObjectState,
                    groupPurposeDescriptions: [...groupPurposeDescriptions],
                },
            });
            if (!_isEmpty(groupPurposeDescriptions)) {
                groupPurposeDescriptions.map((desc) => {
                    let tempObj = {};
                    tempObj.description = desc.description;
                    tempObj.purpose = desc.purpose;
                    tempArr.push(tempObj);
                });
            }
            if (!fromCreate) {
                const editObject = {
                    attributes: {},
                    groupPurposeDescriptions: [...tempArr],
                };
                dispatch(editGivingGroupApiCall(editObject, groupId));
            }
        }
    }
    handleContinue = () => {
        this.setState({
            disableContinue: true,
        });
        const {
            createGivingGroupObjectState: {
                attributes: {
                    short,
                }
            }
        } = this.state;
        const {
            dispatch,
        } = this.props;
        if (short === '') {
            this.setState({
                doesDescriptionPresent: false,
            });
            return;
        }
        dispatch(updateCreateGivingGroupObj(this.state.createGivingGroupObjectState));
        Router.pushRoute(createGivingGroupFlowSteps.stepThree);
    };

    resetPageViewStatus = () => {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
                pageStatus: {
                    menuView: true,
                    pageView: false,
                },
            },
            type: 'SET_MANAGE_PAGE_STATUS',
        });
    };
    render() {
        const {
            addModalSectionObject,
            createGivingGroupObjectState: {
                attributes: {
                    short,
                },
                groupPurposeDescriptions,
            },
            disableContinue,
            doesDescriptionPresent,
            showModal,
            isEdit,
            isWhiteSpace,
        } = this.state;
        const {
            dispatch,
            fromCreate,
            groupId,
            t: formatMessage,
        } = this.props;
        return (
            <Container>
                <div className={fromCreate ? 'createNewGroupWrap' : 'manageGroupWrap createNewGroupWrap'}>
                    {fromCreate && <CreateGivingGroupHeader
                        breakCrumArray={breakCrumArray}
                        currentActiveStepCompleted={currentActiveStepCompleted}
                        header={formatMessage('createGivingGroupHeader')}
                    />
                    }
                    <div className='mainContent'>
                        <div className='about-group'>
                            <Header
                                className='titleHeader'
                            >
                                {!fromCreate
                                && (
                                    <Responsive minWidth={320} maxWidth={767}>
                                        <span>
                                            <i
                                                aria-hidden="true"
                                                className="back_to_menu icon"
                                                onClick={this.resetPageViewStatus}
                                            />
                                        </span>
                                    </Responsive>
                                )}
                                {formatMessage('createGivingGroupAbout.aboutHeader')}
                            </Header>
                            <Form>
                                <div className={`createnewSec ${fromCreate ? 'bottom_space' : ''}`}>
                                    <label className={`describe ${!fromCreate ? 'Describe_about' : ''}`}>{formatMessage('createGivingGroupAbout.aboutDescriptionLabel')}</label>
                                    <p className={`label-info ${fromCreate ? 'aboutDescription' : ''}`}>{formatMessage('createGivingGroupAbout.aboutDescription')}</p>
                                    {fromCreate ? (
                                        <div className='requiredfield field'>
                                            <Form.Field
                                                control={TextArea}
                                                value={short}
                                                onChange={this.handleOnChange}
                                                onBlur={this.handleOnBlur}
                                                name="short"
                                                error={!doesDescriptionPresent}
                                                maxLength={aboutDescriptionLimit}
                                            />
                                            <FormValidationErrorMessage
                                                condition={!doesDescriptionPresent}
                                                errorMessage="The field is required"
                                            />
                                            <FormValidationErrorMessage
                                                condition={!isWhiteSpace}
                                                errorMessage="This field should not be empty space"
                                            />
                                            <div className='fieldInfoWrap create_description_count'>
                                                <div class="field-info">{short.length}/300</div>
                                            </div>
                                        </div>)
                                        :
                                        (
                                            <div className='about_descCardWrap'>
                                                <EditGivingGroupDescriptionModal
                                                    editGivingGroupObject={this.state.createGivingGroupObjectState}
                                                    formatMessage={formatMessage}
                                                    groupId={groupId}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='createnewSec'>
                                    <Header className='sectionHeader'>{formatMessage('createGivingGroupAbout.additionAboutDescriptionHeader')}
                                    </Header>
                                    <p>{formatMessage('createGivingGroupAbout.additionAboutDescriptionDescriptionLabel')}</p>
                                    {!_isEmpty(groupPurposeDescriptions)
                                        &&
                                        <SortableList
                                            addSectionItems={groupPurposeDescriptions}
                                            onSortEnd={this.onSortEnd}
                                            disableAutoscroll={true}
                                            handleOnSortableItemClick={this.handleOnSortableItemClick}
                                            handleOnSortableItemDelete={this.handleOnSortableItemDelete}
                                            pressDelay={220}
                                            lockAxis='y'
                                        />
                                    }
                                    {groupPurposeDescriptions && groupPurposeDescriptions.length < 5 &&
                                        <CreateGivingGroupAddSectionModal
                                            addModalSectionObject={addModalSectionObject}
                                            handleParentModalClick={this.handleParentModalClick}
                                            showModal={showModal}
                                            formatMessage={formatMessage}
                                            isEdit={isEdit}
                                        />
                                    }
                                </div>
                            </Form>
                            {fromCreate && <div className='buttonsWrap'>
                                <Button
                                    className='blue-bordr-btn-round-def'
                                    onClick={() => {
                                        dispatch(updateCreateGivingGroupObj(this.state.createGivingGroupObjectState));
                                        Router.pushRoute(createGivingGroupFlowSteps.stepOne)
                                    }}
                                >
                                    {formatMessage('backButton')}
                                </Button>
                                <Button
                                    className='blue-btn-rounded-def'
                                    disabled={disableContinue || !doesDescriptionPresent || !isWhiteSpace}
                                    onClick={this.handleContinue}
                                >
                                    {formatMessage('continueButton')}
                                </Button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

CreateGivingGroupAbout.defaultProps = {
    createGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup },
    editGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    fromCreate: true,
    dispatch: () => { },
};
export default React.memo(withTranslation('givingGroup')(connect(null)(CreateGivingGroupAbout)));
