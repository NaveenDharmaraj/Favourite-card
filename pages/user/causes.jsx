/* eslint-disable react/prop-types */
/* eslint-disable operator-assignment */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Header,
    Form,
    Radio,
    Grid,
    Container,
    List,
} from 'semantic-ui-react';
import _ from 'lodash';

import Layout from '../../components/shared/Layout';
// import FormValidationErrorMessage from '../../components/shared/FormValidationErrorMessage';
import { getUserCauses } from '../../actions/onBoarding';
import { saveUserCauses,
        } from '../../actions/user';
import SingleCause from '../../components/New/SingleCause';
import { Router } from '../../routes';

class CausesMigration extends React.Component {
    static async getInitialProps({
        reduxStore,
    }) {
        await getUserCauses(reduxStore.dispatch);
        return {};
    }

    constructor(props) {
        super(props);
        const {
            currentUser: {
                attributes: {
                    preferences: {
                        discoverability,
                    },
                },
            },
        } = props;
        this.state = {
            stepIndex: 0,
            discoverValue: (discoverability) ? discoverability : false,
            userCauses: [],
        };
        this.handleCauses = this.handleCauses.bind(this);
        this.handleCausesSubmit = this.handleCausesSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e, { value }) => {
        return this.setState({ discoverValue: value });
    };

    handleCausesSubmit() {
        const {
            userCauses,
            discoverValue,
        } = this.state;
        const {
            dispatch,
            currentUser,
        } = this.props;
        if (currentUser && currentUser.id) {
            dispatch({
                payload: {
                    continueButtonDisable: true,
                },
                type: 'DISABLE_BUTTON_IN_USER_MIGRATION'
            });
            saveUserCauses(dispatch, currentUser.id, userCauses, discoverValue);
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
    }

    render() {
        const {
            causesList,
            currentUser,
        } = this.props;
        const {
            discoverValue,
            userCauses,
            stepIndex,
        } = this.state;
        let addCauses = false;
        if (!_.isEmpty(currentUser)) {
            const {
                attributes: {
                    causes,
                    preferences: {
                        discoverability,
                    }
                },
            } = currentUser;
            if (_.isEmpty(causes)) {
                addCauses = true;
            } else {
                Router.pushRoute('/dashboard');
            }
        }
        const renderCauses = () => {
            const causesBlock = [];
            if (!_.isEmpty(causesList)) {
                causesList.forEach((cause, i) => {
                    causesBlock.push(<SingleCause
                        parentHandleCauses={this.handleCauses}
                        userCauses={userCauses}
                        cause={cause}
                        index={i % 12}
                    />);
                });
            }
            return causesBlock;
        };

        return (
            <Layout authRequired={true} addCauses={addCauses}>
                <Fragment>
                    <div className="pageWraper">
                        <Container>
                            <div className="linebg">
                                {
                                    (stepIndex === 1) && (
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column mobile={16} tablet={16} computer={2} largeScreen={4} className="causesLeftImg">
                                                    <div/>
                                                </Grid.Column>
                                                <Grid.Column mobile={16} tablet={16} computer={14} largeScreen={12}>
                                                    <div className="prefered-wraper">
                                                        <div className="prefered-img" />
                                                        <div className="pb-3 stepList">
                                                            <ul>
                                                                <li className="active">1. Discoverability</li>
                                                                <li className="active">2. Causes</li>
                                                            </ul>
                                                        </div>
                                                        <div className="reg-header">
                                                            <Header as="h3" className="pb-3">A couple of quick questions before heading to your account...</Header>
                                                            <Header as="h4" className="font-s-20">What causes are important to you? </Header>
                                                            <p className="pb-2">
                                                            Select causes to see charities and Giving Groups that might interest you. You’ll see them in the <b>"discovered for you"</b> section of your account.
                                                            </p>
                                                        </div>
                                                        <p>Select as many as you like:</p>
                                                        <Grid className="select-btn-wraper">
                                                            <Grid.Row>
                                                                {renderCauses()}
                                                            </Grid.Row>
                                                        </Grid>
                                                        <p className="causes-selection">Only you can see causes you care about unless you decide to share them on your personal profile. We don't share your selected causes with charities or anyone else.</p>
                                                        <div className="reg-btn-wraper">
                                                            <Button
                                                                className="blue-bordr-btn-round-def"
                                                                content="Back"
                                                                onClick={()=>{this.setState({stepIndex:0})}}
                                                                disabled={this.props.disableMigrationButtons}
                                                            />
                                                            <Button
                                                                type="submit"
                                                                disabled={this.props.disableMigrationButtons}
                                                                primary
                                                                onClick={this.handleCausesSubmit}
                                                            >
                                                            Continue
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    )
                                }
                                {
                                    (stepIndex === 0) && (
                                        <Grid>
                                            <Grid.Column mobile={16} tablet={16} computer={2} largeScreen={4} className="discoverLeftImg">
                                                <div/>
                                            </Grid.Column>
                                            <Grid.Column mobile={16} tablet={16} computer={14} largeScreen={12}>
                                                <div className="prefered-wraper discoverContent">
                                                    <div className="pb-3 stepList">
                                                        <ul>
                                                            <li className="active">1. Discoverability</li>
                                                            <li>2. Causes</li>
                                                        </ul>
                                                    </div>
                                                    <div className="reg-header quickquestions">
                                                        <Header as="h3" className="pb-1">A couple of quick questions before heading to your account...</Header>
                                                        <Header as="h4" className="font-s-20">Show your personal profile on Charitable Impact?
                                                        </Header>
                                                        <List bulleted>
                                                            <List.Item className="profile">Others who are logged in can search for you and request to add you as a friend</List.Item>
                                                            <List.Item className="profile">Friends can easily send you charitable dollars that you can give away</List.Item>
                                                            <List.Item className="profile">Choose what information to share on your profile or hide from others</List.Item>
                                                        </List>
                                                    </div>
                                                    <div className="reg-header">
                                                        <Form className="discoverRadio">
                                                            <Form.Field>
                                                                <Radio
                                                                    label="No, keep my profile private"
                                                                    name="discover"
                                                                    value={false}
                                                                    onChange={this.handleChange}
                                                                    checked={discoverValue === false}
                                                                    defaultChecked
                                                                />
                                                                <Radio
                                                                    label="Yes, I want my profile to be discoverable"
                                                                    name="discover"
                                                                    value={true}
                                                                    onChange={this.handleChange}
                                                                    checked={discoverValue === true}
                                                                />
                                                            </Form.Field>
                                                        </Form>
                                                    </div>
                                                    <div className="reg-btn-wraper">
                                                        <Button
                                                            type="submit"
                                                            primary
                                                            onClick={()=> {this.setState({stepIndex:1})}}
                                                        >
                                                            Continue
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Grid.Column>
                                        </Grid>
                                    )
                                }
                            </div>
                        </Container>
                    </div>
                </Fragment>
            </Layout>
        );
    }
}


CausesMigration.defaultProps = {
    disableMigrationButtons: false,
};

function mapStateToProps(state) {
    return {
        causesList: state.onBoarding.causesList,
        currentUser: state.user.info,
        disableMigrationButtons: state.user.disableMigrationButtons
    };
}

export default connect(mapStateToProps)(CausesMigration);
