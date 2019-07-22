import React from 'react';
import {
    Image,
    Menu,
} from 'semantic-ui-react';

const Profile = () => (
    <Menu.Item as="a" className="user-img">
        <Image src="https://react.semantic-ui.com/images/wireframe/square-image.png" style={{ width: '35px' }} circular />
    </Menu.Item>
);

export default Profile;
