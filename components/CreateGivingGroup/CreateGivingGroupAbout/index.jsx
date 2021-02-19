import React from 'react';
import {
    Container,
    Header,
    Button,
    Form,
    TextArea,
    Icon,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import arrayMove from 'array-move';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import { aboutDescriptionLimit, createGivingGroupBreadCrum, CreateGivingGroupFlowSteps, generateBreadCrum, initializeAddSectionModalObject, intializeCreateGivingGroup } from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import CreateGivingGroupAddSectionModal from '../CreateGivingGroupAddSectionModal';
import { updateCreateGivingGroupObj } from '../../../actions/createGivingGroup';
import { withTranslation } from '../../../i18n';

const SortableList = dynamic(() => import('../../shared/DragAndDropComponent'), { ssr: false });

let breakCrumArray;
const currentActiveStepCompleted = [1, 2];

class CreateGivingGroupAbout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addModalSectionObject: initializeAddSectionModalObject,
            disableContinue: !_isEmpty((props.createGivingGroupStoreFlowObject)
                && props.createGivingGroupStoreFlowObject.attributes
                && props.createGivingGroupStoreFlowObject.attributes.short) ? false : true,
            showModal: false,
            createGivingGroupObjectState: !_isEmpty(props.createGivingGroupStoreFlowObject) ? props.createGivingGroupStoreFlowObject : intializeCreateGivingGroup,
            doesDescriptionPresent: true,
        }
        breakCrumArray = createGivingGroupBreadCrum(props.t);
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ createGivingGroupObjectState }) => ({
            createGivingGroupObjectState: {
                ...createGivingGroupObjectState,
                groupDescriptions: arrayMove(createGivingGroupObjectState.groupDescriptions, oldIndex, newIndex),
            }
        }));
    };

    handleOnChange = (event, data) => {
        let {
            name,
            value,
        } = data || event.target;
        const {
            createGivingGroupObjectState
        } = this.state;
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
        })
    };

    handleOnBlur = (event, data) => {
        let {
            value,
        } = data || event.target;
        this.setState({
            doesDescriptionPresent: value ? true : false
        })
    };

    handleParentModalClick = (modalState, addSectionObject = {}) => {
        const {
            createGivingGroupObjectState: {
                groupDescriptions,
            },
            addModalSectionObject,
        } = this.state;
        if (!_isEmpty(addSectionObject)) {
            let index;
            groupDescriptions.find((item, i) => {
                if (item.id === addModalSectionObject.id) {
                    index = i;
                    return;
                }
            });
            Number(index) >= 0 ? groupDescriptions.splice(index, 1, addSectionObject) :
                groupDescriptions.push(
                    { ...addSectionObject, id: `${addSectionObject.name}${groupDescriptions.length}` }
                );
            this.setState({
                createGivingGroupObjectState: {
                    ...this.state.createGivingGroupObjectState,
                    groupDescriptions: [...groupDescriptions],
                },
                showModal: modalState
            })
        } else {
            this.setState({
                addModalSectionObject: initializeAddSectionModalObject,
                showModal: modalState
            })
        }
    };
    handleOnSortableItemClick = (modalState, currentSelectedCard = initializeAddSectionModalObject) => {
        this.setState({
            addModalSectionObject: currentSelectedCard,
            showModal: modalState
        });
    };
    handleOnSortableItemDelete = (event, addSectionObject = {}) => {
        event.stopPropagation();
        const {
            createGivingGroupObjectState: {
                groupDescriptions,
            },
        } = this.state;
        if (!_isEmpty(addSectionObject)) {
            let index;
            groupDescriptions.find((item, i) => {
                if (item.id === addSectionObject.id) {
                    index = i;
                    return;
                }
            });
            Number(index) >= 0 ? groupDescriptions.splice(index, 1) :
                this.setState({
                    createGivingGroupObjectState: {
                        ...this.state.createGivingGroupObjectState,
                        groupDescriptions: [...groupDescriptions],
                    },
                })
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
            dispatch
        } = this.props;
        if (short === '') {
            this.setState({
                doesDescriptionPresent: false,
            });
            return;
        }
        dispatch(updateCreateGivingGroupObj(this.state.createGivingGroupObjectState));
        Router.pushRoute(CreateGivingGroupFlowSteps.stepThree);

    };
    render() {
        const {
            addModalSectionObject,
            createGivingGroupObjectState: {
                attributes: {
                    short,
                },
                groupDescriptions,
            },
            disableContinue,
            doesDescriptionPresent,
            showModal,
        } = this.state;
        const {
            dispatch,
            t: formatMessage,
        } = this.props;
        return (
            <Container>
                <div className='createNewGroupWrap'>
                    <div className='createNewGrpheader'>
                        <Header as='h2'>{formatMessage('createGivingGroupHeader')}</Header>
                        {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
                    </div>
                    <div className='mainContent'>
                        <div className='about-group'>
                            <Header className='titleHeader'>{formatMessage('createGivingGroupAbout.aboutHeader')}</Header>
                            <Form>
                                <div className='createnewSec'>
                                    <div className='requiredfield field'>
                                        <label>{formatMessage('createGivingGroupAbout.aboutDescriptionLabel')}</label>
                                        <p className='label-info'>{formatMessage('createGivingGroupAbout.aboutDescription')}</p>
                                        <Form.Field
                                            control={TextArea}
                                            value={short}
                                            onChange={this.handleOnChange}
                                            onBlur={this.handleOnBlur}
                                            name="short"
                                            error={!doesDescriptionPresent}
                                            maxLength={aboutDescriptionLimit}
                                        />
                                        <div className='fieldInfoWrap'>
                                            <p className="error-message">
                                                {!doesDescriptionPresent
                                                    &&
                                                    (
                                                        <>
                                                            <Icon name="exclamation circle" />
                                                            The field is required
                                                        </>
                                                    )
                                                }
                                            </p>
                                            <div class="field-info">{short.length} {formatMessage('ofText')} 300</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='createnewSec'>
                                    <Header className='sectionHeader'>{formatMessage('createGivingGroupAbout.additionAboutDescriptionHeader')}
                                        <span className='optional'>&nbsp;{formatMessage('createGivingGroupAbout.additionAboutDescriptionHeaderOptional')}</span></Header>
                                    <p>{formatMessage('createGivingGroupAbout.additionAboutDescriptionDescriptionLabel')}</p>
                                    {!_isEmpty(groupDescriptions)
                                        &&
                                        <SortableList
                                            addSectionItems={groupDescriptions}
                                            onSortEnd={this.onSortEnd}
                                            disableAutoscroll={true}
                                            handleOnSortableItemClick={this.handleOnSortableItemClick}
                                            handleOnSortableItemDelete={this.handleOnSortableItemDelete}
                                            pressDelay={220}
                                            lockAxis='y'
                                        />
                                    }
                                    {groupDescriptions.length < 5 &&
                                        <CreateGivingGroupAddSectionModal
                                            addModalSectionObject={addModalSectionObject}
                                            handleParentModalClick={this.handleParentModalClick}
                                            showModal={showModal}
                                            formatMessage={formatMessage}
                                        />
                                    }
                                </div>
                            </Form>
                            <div className='buttonsWrap'>
                                <Button
                                    className='blue-bordr-btn-round-def'
                                    onClick={() => {
                                        dispatch(updateCreateGivingGroupObj(this.state.createGivingGroupObjectState));
                                        Router.pushRoute(CreateGivingGroupFlowSteps.stepOne)
                                    }}
                                >
                                    {formatMessage('backButton')}
                                </Button>
                                <Button
                                    className='blue-btn-rounded-def'
                                    disabled={disableContinue || !doesDescriptionPresent}
                                    onClick={this.handleContinue}
                                >
                                    {formatMessage('continueButton')}
                                    </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

CreateGivingGroupAbout.defaultProps = {
    createGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup },
    dispatch: () => { }
};
export default React.memo(withTranslation('givingGroup')(connect(null)(CreateGivingGroupAbout)));
