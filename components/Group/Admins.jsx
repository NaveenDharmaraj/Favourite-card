import React from 'react';
import {
    List,
    Image,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
    arrayOf,
    PropTypes,
    string,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import {
    Link,
} from '../../routes';

const Admins = (props) => {
    const {
        groupAdminsDetails: {
            data,
        },
    } = props;
    let adminData = '';
    if (!_isEmpty(data)) {
        adminData = data.map((admin) => {
            return (
                <Link route={(`/users/profile/${admin.id}`)}>
                    <List.Item as="a">
                        <Image className="grProfile" src={admin.attributes.avatar} />
                        <List.Content>
                            <List.Header>{admin.attributes.displayName}</List.Header>
                        </List.Content>
                    </List.Item>
                </Link>
            );
        });
    }
    return (
        <div className="ch_share">
            <List horizontal relaxed="very" className="GroupPrfile">
                { adminData }
            </List>
        </div>
    );
};

Admins.defaultProps = {
    groupAdminsDetails: {
        data: [],
        links: {
            next: '',
        },
    },
};

Admins.propTypes = {
    groupAdminsDetails: {
        data: arrayOf(PropTypes.element),
        links: PropTypes.shape({
            next: string,
        }),
    },
};

function mapStateToProps(state) {
    return {
        groupAdminsDetails: state.group.groupAdminsDetails,
    };
}

export default connect(mapStateToProps)(Admins);
