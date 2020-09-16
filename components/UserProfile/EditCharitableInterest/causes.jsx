/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Modal,
    Button,
    Header,
    Grid,
    Responsive,
    Icon,
    Input,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
    getUserProfileCauses,
} from '../../../actions/userProfile';
import SingleCause from '../../New/SingleCause';

class MyCauses extends React.Component {
    constructor(props) {
        super(props);
        const userCauses = [];
        if (!_.isEmpty(props.userCausesList)) {
            props.userCausesList.forEach((cause) => {
                if (typeof cause.attributes.status !== 'undefined') {
                    userCauses.push(cause.attributes.name);
                }
            });
        }
        this.state = {
            userCauses,
        };
        this.handleCauses = this.handleCauses.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getUserProfileCauses(dispatch, id);
    }

    componentDidUpdate(prevProps) {
        const {
            userCausesList,
        } = this.props;
        const {
            userCauses,
        } = this.state;
        if (!_.isEqual(userCausesList, prevProps.userCausesList) && !_.isEmpty(userCausesList)) {
            userCausesList.forEach((cause) => {
                if (typeof cause.attributes.status !== 'undefined') {
                    userCauses.push(cause.attributes.name);
                }
            });
            this.setState({ userCauses });
        }
    }

    handleCauses(event, data) {
        const {
            name,
        } = data;
        const {
            userCauses,
        } = this.state;
        if (_.includes(userCauses, name)) {
            _.pull(userCauses, name);
        } else {
            userCauses.push(name);
        }
        this.setState({
            userCauses,
        });
        this.props.getSelectedCauses(this.state.userCauses);
    }

    renderCauses() {
        const {
            userCausesList,
        } = this.props;
        const {
            userCauses,
        } = this.state;
        const causesBlock = [];
        if (!_.isEmpty(userCausesList)) {
            userCausesList.forEach((cause, i) => {
                causesBlock.push(<SingleCause
                    parentHandleCauses={this.handleCauses}
                    userCauses={userCauses}
                    cause={cause}
                    index={i % 12}
                />);
            });
        }
        return causesBlock;
    }

    render() {
        const {
            userProfileBasicData,
        } = this.props;
        let causesVisible = 0;
        if (!_.isEmpty(userProfileBasicData)) {
            causesVisible = userProfileBasicData.data[0].attributes.causes_visibility;
        }
        const privacyColumn = 'causes_visibility';
        return (
            <div className="causesec">
                <Header as='h4'>Causes</Header>
                <p>Causes represent broader areas of charitable interests.</p>
                <div className='causeselect-wraper'>
                    {this.renderCauses()}
                </div>
            </div>
            // <div>
            //     <p className="mb-1-2">
            //         <strong>Your causes and topics</strong>
            //         <PrivacySetting
            //             columnName={privacyColumn}
            //             columnValue={causesVisible}
            //         />
            //     </p>
            //     <p className="mb-1-2 mt-1">
            //         Select causes, topics, or both to discover charities and Giving Groups that might interest you.
            //     </p>
            //     <div className="font-s-10">
            //         Only you can see causes and topics you care about unless you decide to share them on your personal profile. We don’t share your selected causes and topics with charities or anyone else.
            //     </div>
            //     <p className="mb-1-2 mt-1">
            //         <strong>Causes</strong>
            //     </p>
            //     <p>
            //         Causes represent broader areas of charitable interests.
            //     </p>
            //     <div className="prefered-wraper noImg pb-2">
            //         <Grid>
            //             <Grid.Row>
            //                 <Grid.Column mobile={16} tablet={14} computer={14}>
            //                     <Grid className="select-btn-wraper" stretched columns="6" doubling stackable>
            //                         <Grid.Row>
            //                             {this.renderCauses()}
            //                         </Grid.Row>
            //                     </Grid>
            //                 </Grid.Column>
            //             </Grid.Row>
            //         </Grid>
            //     </div>
            // </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userCausesList: state.userProfile.userCausesList,
        userProfileBasicData: state.userProfile.userProfileBasicData,
    };
}

export default (connect(mapStateToProps)(MyCauses));
