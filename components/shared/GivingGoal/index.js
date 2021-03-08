import React, { Fragment, useState, useRef, useEffect } from 'react';
import {
    Button,
    Grid,
    Header,
    Image,
    Icon,
    Popup,
    Responsive
} from 'semantic-ui-react';
import _cloneDeep from 'lodash/cloneDeep';
import _every from 'lodash/every';

import { formatDateForGivingTools } from '../../../helpers/give/utils';
import { validateGivingGoal } from '../../../helpers/users/utils';
import SharedModal from '../SharedModal';
import { editGivingGroupApiCall } from '../../../actions/createGivingGroup';


const GivingGoal = ({
    createGivingButtonLoader,
    createGivingGroupObject,
    dispatch,
    fundraisingGoal,
    fundraisingDate,
    fundraisingDaysRemaining,
    fundraisingCreated,
    fundraisingPercentage,
    goalAmountRaised,
    groupId,
    handleCreateGroup,
    modalContent,
    setCreateGivingGroupObject
}) => {
    const contextRef = React.useRef();
    const createGivingGroupObjectClone = _cloneDeep(createGivingGroupObject);
    const previousGivingGroupObject = useRef();
    const [showEditModal, setShowEditModal] = useState(false);
    const endDate = fundraisingDate ? formatDateForGivingTools(fundraisingDate) : null;
    const currentDate = formatDateForGivingTools(new Date());
    let BarWidth = fundraisingPercentage || 0;
    useEffect(() => {
        previousGivingGroupObject.current = createGivingGroupObjectClone;
    }, [])
    const toolTopPos = (goalValue) => {

        if (goalValue < 20) {
            return 'top left';
        }
        else if (goalValue > 80) {
            return 'top right';
        }
        else if (goalValue > 20 && goalValue < 80) {
            return 'top center';
        }
    }
    const handleClose = () => {
        setShowEditModal(false);
        setCreateGivingGroupObject(previousGivingGroupObject.current);
    }
    const handleSaveGivingGoal = () => {
        setShowEditModal(false);
        handleCreateGroup()
    }
    const handleDeleteGivingGoal = () => {
        dispatch(editGivingGroupApiCall({
            attributes: {
                fundraisingGoal: "",
                fundraisingCreated: null,
                fundraisingDate: null,
            },
        }, groupId))
    };
    return (
        <>
            {showEditModal ?
                <SharedModal
                    handleClose={handleClose}
                    handleSave={handleSaveGivingGoal}
                    modalHeader={'Edit Giving Goal'}
                    modalContent={modalContent}
                    modalFooterSave={'Save'}
                    modalFooterCancel={'Cancel'}
                    showModal={showEditModal}
                    showLoader={createGivingButtonLoader}
                /> :
                <div className='basicsettings'>
                    <Header className='titleHeader'>
                        <Responsive maxWidth={767}>
                            <Icon name='back'></Icon>
                        </Responsive>
                Giving Goal
            </Header>
                    <div className='givingGoalWrap'>
                        <div className='headerWrap'>
                            <Grid>
                                <Grid.Column computer={2} mobile={4} >
                                    <Image src='../../../static/images/givinggroup_banner.png' />
                                </Grid.Column>
                                <Grid.Column computer={9} mobile={12}>
                                    <div className='headerContent'>
                                        {Number(fundraisingPercentage) === 100 ?
                                            <>
                                                <p>Congratulations! The group has reached its goal!</p>
                                                <p>Keep going. You can set a new goal by selecting 'Edit' and add a new goal amount.</p>
                                            </>
                                            :
                                            <Fragment>
                                                {Number(fundraisingDaysRemaining === 0) ?
                                                    <>
                                                        <p>Your goal has expired.</p>
                                                        <p>You can set a new goal by selecting 'Edit' to add a new goal amount or extend its end date.</p>
                                                    </>
                                                    :
                                                    <p>Your group has set a goal to raise ${fundraisingGoal} by {endDate}.</p>
                                                }
                                            </Fragment>
                                        }
                                    </div>
                                </Grid.Column>
                                {Number(fundraisingDaysRemaining > 0) ?
                                    <Grid.Column computer={5} mobile={16} >
                                        <p className='daysleftText'>{fundraisingDaysRemaining} days left to reach goal</p>
                                    </Grid.Column>
                                    : ''
                                }
                            </Grid>
                        </div>
                        <div className='contentWrap'>
                            <Header as='h5'>Progress</Header>
                            <Grid>
                                <Grid.Column computer={4} mobile={8}>
                                    <p>Goal</p>
                                    <Header as='h3'>${fundraisingGoal}</Header>
                                </Grid.Column>
                                <Grid.Column computer={4} mobile={8}>
                                    <p>Money raised</p>
                                    <Header as='h3'>${goalAmountRaised}</Header>
                                </Grid.Column>
                                <Grid.Column computer={8} mobile={16}>
                                    <div class="ui progress">
                                        <div class="bar" style={{ width: BarWidth + '%' }}>
                                            <div class="progress">{BarWidth}%</div>
                                            <div className='tooltipPos' ref={contextRef}></div>
                                        </div>
                                        <div class="label">
                                            <span>{fundraisingCreated ? formatDateForGivingTools(fundraisingCreated) : null}</span>
                                            <span>{endDate ? formatDateForGivingTools(endDate) : null}</span>
                                        </div>
                                    </div>
                                    <Popup
                                        context={contextRef}
                                        content={`${Number(fundraisingPercentage) === 100 ? 'Reached goal on ' : ''}${currentDate}`}
                                        open
                                        position={toolTopPos(BarWidth)}
                                        className='progress-tooltip'
                                    />
                                </Grid.Column>
                            </Grid>
                        </div>
                        <div className='footerWrap'>
                            <Grid>
                                <Grid.Column computer={8} mobile={16} >
                                    <p>When you edit or delete a giving goal, the total money raised is not affected.</p>
                                    <p>When you delete a giving goal, it will reset your goal.</p>
                                </Grid.Column>
                                <Grid.Column computer={8} mobile={16} >
                                    <Button
                                        className='blue-bordr-btn-round-def'
                                        onClick={() => setShowEditModal(true)}
                                    >
                                        Edit
                                </Button>
                                    <Button
                                        className='blue-bordr-btn-round-def'
                                        onClick={() => handleDeleteGivingGoal()}
                                    >
                                        Delete
                                        </Button>
                                </Grid.Column>
                            </Grid>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

GivingGoal.defaultProps = {
    createGivingButtonLoader: false,
    dispatch: () => { },
    fundraisingGoal: '0',
    fundraisingDate: null,
    fundraisingDaysRemaining: '0',
    fundraisingCreated: null,
    fundraisingPercentage: '0',
    goalAmountRaised: '0',
    groupId: '',
    handleCreateGroup: () => { },
    validity: {},
}
export default GivingGoal;
