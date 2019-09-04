/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Icon,
    Popup,
    Grid,
    List,
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
            props.userCausesList.forEach((cause, i) => {
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
            userCausesList.forEach((cause, i) => {
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
        return (
            <div>
                <p className="mb-1-2">
                    <strong>Charitable interests</strong>
                    <Popup
                        trigger={<a className="font-s-10 d-in-block hoverable" style={{marginLeft:'.5rem'}}>Privacy settings > </a>}
                        on="click"
                        pinned
                        position="bottom left"
                        className="privacy-popup"
                        basic
                    >
                        <Popup.Header>I want this to be visible to:</Popup.Header>
                        <Popup.Content>
                            <List divided verticalAlign="middle" className="selectable-tick-list">
                                <List.Item className="active">
                                    <List.Content>
                                        <List.Header as="a">Public <span className="tick-mark"><Icon name="check"/></span></List.Header>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header as="a">Friends</List.Header>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <List.Header as="a">Only me</List.Header>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Popup.Content>
                        <div className="popup-footer">
                            <Button size="tiny" className="blue-btn-rounded-def">Save</Button>
                            <Button size="tiny" className="blue-bordr-btn-round-def">Cancel</Button>
                        </div>
                    </Popup>
                </p>
                <p>
                    Select causes to discover charities and
                    Giving Groups that match your interests.
                </p>
                <div className="prefered-wraper noImg">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width="14">
                                <Grid className="select-btn-wraper" stretched columns="6" doubling stackable>
                                    <Grid.Row>
                                        {this.renderCauses()}
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userCausesList: state.userProfile.userCausesList,
    };
}

export default (connect(mapStateToProps)(MyCauses));
