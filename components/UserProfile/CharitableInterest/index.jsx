/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Table,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getUserCharitableInterests,
} from '../../../actions/userProfile';
import PlaceHolderGrid from '../../shared/PlaceHolder';

class CharitableInterestsList extends React.Component {
    componentDidMount() {
        const {
            friendUserId,
            dispatch,
        } = this.props;
        dispatch(getUserCharitableInterests(friendUserId));
    }

    componentWillUnmount() {
        const {
            dispatch,
        } = this.props;
        dispatch({
            payload: {
            },
            type: 'USER_PROFILE_CHARITABLE_INTERESTS',
        });
    }

    charitableInterestsList() {
        const {
            userProfileCharitableData,
        } = this.props;
        let interestsList = 'Nothing to show here yet.';
        if (userProfileCharitableData
            && userProfileCharitableData.data
            && _.size(userProfileCharitableData.data) > 0) {
            interestsList = userProfileCharitableData.data.map((data) => {
                const name = data.attributes.display_name !== '' ? data.attributes.display_name : data.attributes.name;
                return (
                    <span className="badge font-s-14 medium">{name}</span>
                );
            });
        }
        return (
            <div className="badge-group">
                {
                    !_.isEmpty(userProfileCharitableData) && (
                        <React.Fragment>
                            {interestsList}
                        </React.Fragment>
                    )
                }
            </div>
        );
    }

    render() {
        const {
            userProfileCharitableData,
            userProfileCharitableInterestsLoadStatus,
        } = this.props;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                        Charitable interests
                    </Header>
                    { (_.isEmpty(userProfileCharitableData) && userProfileCharitableInterestsLoadStatus)
                        ? (
                            <Table padded unstackable className="no-border-table">
                                <PlaceHolderGrid row={1} column={8} placeholderType="table" />
                            </Table>
                        )
                        : (
                            this.charitableInterestsList()
                        )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileCharitableData: state.userProfile.userProfileCharitableData,
        userProfileCharitableInterestsLoadStatus: state.userProfile.userProfileCharitableInterestsLoadStatus,
    };
}


export default (connect(mapStateToProps)(CharitableInterestsList));
