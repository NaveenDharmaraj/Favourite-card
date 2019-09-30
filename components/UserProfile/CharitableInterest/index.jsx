/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getUserCharitableInterests,
} from '../../../actions/userProfile';

class CharitableInterestsList extends React.Component {
    componentDidMount() {
        const {
            friendUserId,
            dispatch,
        } = this.props;
        getUserCharitableInterests(dispatch, friendUserId);
    }

    charitableInterestsList() {
        const {
            userProfileCharitableData,
        } = this.props;
        let interestsList = 'No Data';
        if (userProfileCharitableData
            && userProfileCharitableData.data
            && _.size(userProfileCharitableData.data) > 0) {
            interestsList = userProfileCharitableData.data.map((data) => {
                let name = data.attributes.display_name !== "" ? data.attributes.display_name : data.attributes.name;
                return (
                    <span className="badge font-s-14 medium">{name}</span>
                );
            });
        }
        return (
            <div className="badge-group">
                {interestsList}
            </div>
        );
    }

    render() {       
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                        Charitable interests
                    </Header>
                    {this.charitableInterestsList()}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileCharitableData: state.userProfile.userProfileCharitableData,
    };
}


export default (connect(mapStateToProps)(CharitableInterestsList));
