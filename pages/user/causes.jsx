/* eslint-disable react/prop-types */
/* eslint-disable operator-assignment */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Header,
    Grid,
    Container,
} from 'semantic-ui-react';
import _ from 'lodash';

import Layout from '../../components/shared/Layout';
// import FormValidationErrorMessage from '../../components/shared/FormValidationErrorMessage';
import { getUserCauses } from '../../actions/onBoarding';
import { saveUserCauses } from '../../actions/user';
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
        this.state = {
            userCauses: [],
        };
        this.handleCauses = this.handleCauses.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        const {
            userCauses,
        } = this.state;
        const {
            dispatch,
            currentUser,
        } = this.props;
        if (userCauses.length >= 3 && currentUser && currentUser.id) {
            saveUserCauses(dispatch, currentUser.id, userCauses);
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
            userCauses,
        } = this.state;

        let addCauses = false;
        if (!_.isEmpty(currentUser)) {
            const {
                attributes: {
                    causes,
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
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={2} largeScreen={4} className="causesLeftImg">
                                            <div/>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={16} computer={14} largeScreen={12}>
                                            <div className="prefered-wraper">
                                                <div className="prefered-img" />
                                                <div className="reg-header">
                                                    <Header as="h3">What causes are important to you? </Header>
                                                    <Header as="h4">Your answers help us find charities and Giving Groups that you might be interested in. You'll see them in the new "Discovered for you" section in your account. </Header>
                                                </div>
                                                <p>Choose 3 or more:</p>
                                                <Grid className="select-btn-wraper">
                                                    <Grid.Row>
                                                        {renderCauses()}
                                                    </Grid.Row>
                                                </Grid>
                                                {/* <FormValidationErrorMessage
                                                    condition={ userCauses.length < 3}
                                                    errorMessage="Please select 3 or more causes"
                                                /> */}
                                                <div className="reg-btn-wraper">
                                                    <Button
                                                        type="submit"
                                                        disabled={!(userCauses.length >= 3)}
                                                        primary
                                                        onClick={this.handleSubmit}
                                                    >
                                                        Continue
                                                    </Button>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </div>
                        </Container>
                    </div>
                </Fragment>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        causesList: state.onBoarding.causesList,
        currentUser: state.user.info,
    };
}

export default connect(mapStateToProps)(CausesMigration);
