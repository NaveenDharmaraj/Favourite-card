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
            currentUser: {
                id
            },
            dispatch,
        } = this.props;
        getUserAdminGroup(dispatch, id);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            userProfileAdminGroupData,
        } = this.props;
        let {
            userAdminGroupListLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userProfileAdminGroupData, prevProps.userProfileAdminGroupData)) {
                userAdminGroupListLoader = false;
            }
            this.setState({ userAdminGroupListLoader });
        }
    }

    userAdminGroupList() {
        const {
            userProfileAdminGroupData,
        } = this.props;
        let adminGroupList = 'No Data';
        if (userProfileAdminGroupData
            && userProfileAdminGroupData.data
            && _.size(userProfileAdminGroupData.data) > 0) {
            adminGroupList = userProfileAdminGroupData.data.map((data) => {
                let entityName = '';
                if (data.attributes.city != null) {
                    entityName = `${data.attributes.name}, ${data.attributes.city}, ${data.attributes.province}`;
                } else {
                    entityName = data.attributes.name;
                }
                const url = `/groups/${data.attributes.slug}`;
                return (
                    <LeftImageCard
                        entityName={entityName}
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
                    {adminGroupList}
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {
            userAdminGroupListLoader,
        } = this.state;
        const {
            currentUser: {
                attributes: {
                    firstName,
                }
            },
        } = this.props;
        return (
            <div className="pb-3">
                <Container>
                    <Header as="h4" className="underline">
                    {firstName}'s Giving Groups
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
