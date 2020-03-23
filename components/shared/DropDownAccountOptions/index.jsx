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
    Popup,
    Select,
} from 'semantic-ui-react';

import {
    populateAccountOptions,
} from '../../../helpers/give/utils';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { withTranslation } from '../../../i18n';

class DropDownAccountOptions extends React.Component {

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
        const giveFromHeader = (type === 'donations') ? formatMessage('addingToLabel') : formatMessage('giveFromLabel');
        const giveFromPlaceHolder = (type === 'donations') ? formatMessage('destinationaccountPlaceHolder') : formatMessage('accountPlaceHolder');
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
            <Form.Field
                className="field-loader"
                control={Input}
                disabled
                id={name}
                icon={<Icon name="spinner" loading />}
                iconPosition="left"
                name={name}
                placeholder={formatMessage('preloadedAccountPlaceHolder')}
            />
        );
        if (!_.isEmpty(dropDownData)) {
            fieldData = (
                <Form.Field
                    className="dropdownWithArrowParent"
                    control={Select}
                    error={!validity}
                    id={name}
                    name={name}
                    onBlur={parentOnBlurChange}
                    onChange={parentInputChange}
                    options={dropDownData}
                    placeholder={giveFromPlaceHolder}
                    value={selectedValue}
                />
            );
        }
        if (!userAccountsFetched || !_.isEmpty(dropDownData)) {
            return (
                <Fragment>
                    <Form.Field>
                        <label htmlFor="giveFrom">
                            {giveFromHeader}
                        </label>
                        {fieldData}
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
