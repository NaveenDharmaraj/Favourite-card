import React from 'react';
import _ from 'lodash';
import {
    List,
    Button,
    Modal,
    Input,
    Image,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { Link } from '../../../../routes';
const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class SwitchAccountModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFilteredArray: props.accounts,
        };
        this.searchAccount = this.searchAccount.bind(this);
    }

    searchAccount(e) {
        const searchValue = e.target.value;
        const temp = [];
        const {
            accounts,
        } = this.props;
        const {
            searchFilteredArray, 
        } = this.state;
        if (!_.isEmpty(accounts)) {
            _.filter(accounts, (item) => {
                if (_.lowerCase(item.name).includes(_.lowerCase(searchValue))) {
                    temp.push(item);
                }
            });
        }
        this.setState({ searchFilteredArray: temp });
    }

    render() {
        const {
            close,
            open,
        } = this.props;
        const {
            searchFilteredArray,
        } = this.state;

        return (
            <Modal
                size="tiny"
                dimmer="inverted"
                className="chimp-modal small-close"
                closeIcon
                open={open}
                onClose={close}
            >
                <Modal.Header>Switch Account</Modal.Header>
                <Modal.Content>
                    <Modal.Description className="font-s-16">
                        <div className="messageSearch">
                            <Input fluid iconPosition="left" icon="search" placeholder="Search..." onChange={(event)=>this.searchAccount(event)} />
                        </div>
                        <div className="membersList swichAccounts mt-2">
                            <List divided verticalAlign="middle">
                                {
                                    searchFilteredArray.map((item) => (
                                        <List.Item>
                                            <List.Content floated="right" className="font-s-14">
                                                <a href={`${RAILS_APP_URL_ORIGIN}${item.location}`}>
                                                    <Button className="blue-btn-rounded-def c-small">Select</Button>
                                                </a>
                                            </List.Content>
                                            <Image avatar src={item.avatar} />
                                            <List.Content>
                                                <List.Header className="font-s-14">{item.name}</List.Header>
                                                <List.Description className={`${item.accountType} font-s-14`}>
                                                    {_.capitalize(item.accountType)}
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    ))
                                }
                            </List>
                        </div>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
export default SwitchAccountModal;
