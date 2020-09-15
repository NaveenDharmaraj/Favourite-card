import React, {
    Fragment,
} from 'react';
import {
    Card,
    Header,
    Image,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    bool,
    func,
    string,
    number,
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { withTranslation } from '../../../i18n';

const ProfileCard = (props) => {
    const {
        avatar,
        type,
        name,
        causes,
        location,
    } = props;
    return (
        <Card>
            <Card.Content>
                <div className="cardPrflImg">
                    <Image src={avatar} />
                </div>
                <div className="cardcontentWrap">
                    <Header as="h6" className="groupClr">{type}</Header>
                    <Header as="h4">{name}</Header>
                    <p>{causes}</p>
                    <p>{location}</p>
                    {/* <p>Total Raised: $2,000.00</p> */}
                </div>
                {/* <a className="edit">Edit</a> */}
            </Card.Content>
        </Card>
    );
};

ProfileCard.defaultProps = {
    avatar: '',
    causes: '',
    location: '',
    name: '',
    type: '',
};

ProfileCard.propTypes = {
    avatar: string,
    causes: string,
    location: string,
    name: string,
    type: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

const connectedComponent = withTranslation([
    'common',
])(connect(mapStateToProps)(ProfileCard));
export {
    connectedComponent as default,
    ProfileCard,
    mapStateToProps,
};