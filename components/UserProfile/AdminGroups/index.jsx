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
    getUserAdminGroup,
} from '../../../actions/userProfile';
import placeholderGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import PlaceholderGrid from '../../shared/PlaceHolder';
import LeftImageCard from '../../shared/LeftImageCard';

class UserAdminGroupList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userAdminGroupListLoader: !props.userProfileAdminGroupData,
        };
    }

    componentDidMount() {
        const {            
            dispatch,
            friendUserId,
        } = this.props;
        getUserAdminGroup(dispatch, friendUserId);
    }

    componentDidUpdate(prevProps) {
        const {
            userProfileAdminGroupData,
        } = this.props;
        let {
            userAdminGroupListLoader,
        } = this.state;
        if (!_.isEqual(userProfileAdminGroupData, prevProps.userProfileAdminGroupData)) {
            userAdminGroupListLoader = false;
            this.setState({ userAdminGroupListLoader });
        }
    }

    userAdminGroupList() {
        const {
            userProfileAdminGroupData,
        } = this.props;
        let adminGroupList = 'Nothing to show here yet.';
        if (userProfileAdminGroupData
            && userProfileAdminGroupData.data
            && _.size(userProfileAdminGroupData.data) > 0) {
            adminGroupList = userProfileAdminGroupData.data.map((data) => {
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
                const url = `/groups/${data.attributes.slug}`;
                return (
                    <LeftImageCard
                        entityName={entityName}
                        location={locationDetails}
                        placeholder={placeholderGroup}
                        typeClass="chimp-lbl group"
                        type="giving group"
                        url={url}
                    />
                );
            });
        }
        return (
            <Grid columns="equal" stackable doubling columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        {adminGroupList}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {
            userAdminGroupListLoader,
        } = this.state;
        const {
            friendFirstName,
        } = this.props;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                    {friendFirstName}'s Giving Groups
                    </Header>
                    { userAdminGroupListLoader ? <PlaceholderGrid row={1} column={3} /> : (
                        this.userAdminGroupList()
                    )}
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileAdminGroupData: state.userProfile.userProfileAdminGroupData,
    };
}

export default (connect(mapStateToProps)(UserAdminGroupList));
