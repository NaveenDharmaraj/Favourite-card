import React from 'react';
import {
    Dimmer,
    Header,
    Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _includes from 'lodash/includes';
import _pull from 'lodash/pull';
import {
    getUserProfileCauses,
} from '../../../actions/userProfile';
import SingleCause from '../../New/SingleCause';

class MyCauses extends React.Component {
    constructor(props) {
        super(props);
        const userCauses = [];
        if (!_isEmpty(props.userCausesList)) {
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
        if (!_isEqual(userCausesList, prevProps.userCausesList) && !_isEmpty(userCausesList)) {
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
        if (_includes(userCauses, name)) {
            _pull(userCauses, name);
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
        if (!_isEmpty(userCausesList)) {
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
            userCausesList,
        } = this.props;
        let causesVisible = 0;
        if (!_isEmpty(userProfileBasicData)) {
            causesVisible = userProfileBasicData.data[0].attributes.causes_visibility;
        }
        const privacyColumn = 'causes_visibility';
        return (
            <div className="causesec">
                <Header as='h4'>Causes</Header>
                <p>Causes represent broader areas of charitable interests.</p>
                <div className='causeselect-wraper'>
                    {!_isEmpty(userCausesList)
                        ? this.renderCauses()
                        : (
                            <Dimmer active inverted>
                                <Loader />
                            </Dimmer>
                        )}
                </div>
            </div>
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
