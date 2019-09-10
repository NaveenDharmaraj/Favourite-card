import React, { cloneElement } from 'react';
import {
    Button,
    Image,
    Popup,
    Modal,
    List,
    Dropdown
  } from 'semantic-ui-react'
import moreIcon from '../static/images/icons/icon-ellipsis-big.svg';
class chatNameHead extends React.Component {

    render() {
        return (

        <div className="chatHeader">
            <div className="chatWith">
                New Message
            </div>
            <div className="moreOption">
                <Dropdown className="rightBottom" icon='ellipsis horizontal'>
                    <Dropdown.Menu>
                        <Dropdown.Item text='Edit Group' />
                        <Dropdown.Item text='Leave Group' />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
        );
    }

}

export default chatNameHead