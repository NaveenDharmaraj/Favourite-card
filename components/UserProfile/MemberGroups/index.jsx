/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    getUserMemberGroup,
} from '../../../actions/userProfile';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

class UserMemberGroupList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userMemberGroupListLoader: !props.userProfileMemberGroupData,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            friendUserId,
        } = this.props;
        getUserMemberGroup(dispatch, friendUserId);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            userProfileMemberGroupData,
        } = this.props;
        let {
            userMemberGroupListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userProfileMemberGroupData, prevProps.userProfileMemberGroupData)) {
                userMemberGroupListLoader = false;
            }
            this.setState({ userMemberGroupListLoader });
        }
    }

    userMemberGroupList() {
        const {
            userProfileMemberGroupData,
        } = this.props;
        let memberGroupList = 'Nothing to show here yet.';
        if (userProfileMemberGroupData
            && userProfileMemberGroupData.data
            && _.size(userProfileMemberGroupData.data) > 0) {
            memberGroupList = userProfileMemberGroupData.data.map((data) => {
                const entityName = data.attributes.name;
                let locationDetails = '';
                const locationDetailsCity = (!_.isEmpty(data.attributes.city)) ? data.attributes.city : '';
                const locationDetailsProvince = (!_.isEmpty(data.attributes.province)) ? data.attributes.province : '';
                if (locationDetailsCity === '' && locationDetailsProvince !== '') {
                    locationDetails = locationDetailsProvince;
                } else if (locationDetailsCity !== '' && locationDetailsProvince === '') {
                    locationDetails = locationDetailsCity;
                } else if (locationDetailsCity !== '' && locationDetailsProvince !== '') {
                    locationDetails = `${data.attributes.city}, ${data.attributes.province}`;
                }
                const type = 'giving group';
                const typeClass = 'chimp-lbl group';
                const url = `/groups/${data.attributes.slug}`;
                return (
                    <LeftImageCard
                        entityName={entityName}
                        location={locationDetails}
                        placeholder={placeholderGroup}
                        typeClass={typeClass}
                        type={type}
                        url={url}
                    />
                );
            });
        }
        return (
            <Grid columns="equal" stackable doubling columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        {memberGroupList}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {
            userMemberGroupListLoader,
        } = this.state;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                    Joined Groups
                    </Header>
                    { userMemberGroupListLoader ? <PlaceholderGrid row={1} column={3} /> : (
                        this.userMemberGroupList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileMemberGroupData: state.userProfile.userProfileMemberGroupData,
    };
}


export default (connect(mapStateToProps)(UserMemberGroupList));
