
/* eslint-disable react/prop-types */
import React, {
    Fragment,
} from 'react';
import {
    connect,
} from 'react-redux';
import _ from 'lodash';
import {
    Form,
    Icon,
    Input,
    Placeholder,
    Popup,
    Select,
    Dropdown,
} from 'semantic-ui-react';

import {
    populateAccountOptions,
} from '../../../helpers/give/utils';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { withTranslation } from '../../../i18n';

class DropDownAccountOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatePlaceHolder: false,
        };
        this.handleDropdown = this.handleDropdown.bind(this);
    }

    handleDropdown() {
        const {
            updatePlaceHolder,
        } = this.state;
        this.setState({
            updatePlaceHolder: !updatePlaceHolder,
        });
    }

    renderDropDownFeild() {
        const {
            companiesAccountsData,
            currentUser,
            fund,
            giveTo,
            giveFromUrl,
            userCampaigns,
            userGroups,
            userAccountsFetched,
            selectedValue,
            validity,
            parentInputChange,
            parentOnBlurChange,
            name,
            type,
            reviewBtnFlag,
        } = this.props;
        let dropDownData = null;
        const formatMessage = this.props.t;
        const {
            i18n: {
                language,
            },
        } = this.props;
        const {
            id,
            attributes: {
                avatar,
                firstName,
                lastName,
            },
        } = currentUser;
        const {
            updatePlaceHolder,
        } = this.state;
        const giveFromHeader = (type === 'donations') ? formatMessage('addingToLabel') : formatMessage('giveFromLabel');
        const giveFromPlaceHolder = (type === 'donations') ? formatMessage('destinationaccountPlaceHolder') : formatMessage('accountPlaceHolder');
        const newPlaceholder = updatePlaceHolder ? formatMessage('searchPlaceholder') : giveFromPlaceHolder;
        let newPlaceholderValue = '';
        if (!_.isEmpty(companiesAccountsData) || !_.isEmpty(userCampaigns) || !_.isEmpty(userGroups)) {
            if (giveTo && giveTo.value && giveFromUrl) {
                dropDownData = populateAccountOptions({
                    avatar,
                    companiesAccountsData,
                    firstName,
                    fund,
                    id,
                    lastName,
                    userCampaigns,
                    userGroups,
                }, {
                    formatMessage,
                    language,
                }, giveTo.value);
            } else {
                dropDownData = populateAccountOptions({
                    avatar,
                    companiesAccountsData,
                    firstName,
                    fund,
                    id,
                    lastName,
                    userCampaigns,
                    userGroups,
                }, {
                    formatMessage,
                    language,
                });
            }
        }
        dropDownData = !_.isEmpty(dropDownData) ? dropDownData : null;
        let fieldData = (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
            </Placeholder>
        );
        if (!_.isEmpty(dropDownData)) {
            newPlaceholderValue = selectedValue ? selectedValue.toString() : '';
            fieldData = (
                <div className="dropdownSearch dropdownWithArrowParentnotbg medium">
                    <Dropdown
                        className="dropdownsearchField grouped medium"
                        error={!validity || reviewBtnFlag}
                        onChange={parentInputChange}
                        onBlur={parentOnBlurChange}
                        onOpen={this.handleDropdown}
                        onClose={this.handleDropdown}
                        placeholder={giveFromPlaceHolder}
                        fluid
                        selection
                        options={dropDownData}
                        id={name}
                        name={name}
                        value={selectedValue}
                        selectOnBlur={false}
                        search
                        selectOnNavigation={false}
                        text={_.isEmpty(newPlaceholderValue) ? newPlaceholder : undefined}
                    />
                </div>
            );
        }
        if (!userAccountsFetched || !_.isEmpty(dropDownData)) {
            return (
                <Fragment>
                    <Form.Field>
                        <div className="paymentMethodDropdown">
                            <label htmlFor="giveFrom">
                                {giveFromHeader}
                            </label>
                            <Popup
                                content={formatMessage('allocationsGiveFromPopup')}
                                position="top center"
                                trigger={(
                                    <Icon
                                        color="blue"
                                        name="question circle"
                                        size="large"
                                    />
                                )}
                            />
                            <p className="multipleFriendAmountFieldText">
                            You can give from your personal account or those you administer.
                            </p>
                            {fieldData}
                        </div>
                    </Form.Field>
                    <FormValidationErrorMessage
                        condition={!validity}
                        errorMessage={formatMessage('giveCommon:blankError')}
                    />
                </Fragment>
            );
        }
        return null;
    }

    render() {
        return (
            <Fragment>
                {this.renderDropDownFeild()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state, props) => {
    if (props.type === 'donations') {
        return {
            companiesAccountsData: state.user.companiesAccountsData,
            currentUser: state.user.info,
            fund: state.user.fund,
            userAccountsFetched: state.user.userAccountsFetched,
        };
    }
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        currentUser: state.user.info,
        fund: state.user.fund,
        userAccountsFetched: state.user.userAccountsFetched,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
    };
};

DropDownAccountOptions.defaultProps = {
    type: '',
};

export default withTranslation(['dropDownAccountOptions'])(connect(mapStateToProps)(DropDownAccountOptions));
