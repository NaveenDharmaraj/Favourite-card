import React, { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import {
    Input,
    Form,
    Icon,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import "../../../static/less/datePicker.less";

function ChimpDatePicker({ handleonDateChange, dateValue, name}) {
    const currentDate = new Date();
    const minDateFormat = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    const DatePickerCustomInput = ({ value, onClick, onChange}) => (
        <Form.Field
            control={Input}
            placeholder='yyyy-mm-dd'
            onChange={onChange}
            value={value}
            icon={(
                <Fragment>
                    {(!_isEmpty(value))
                    && (
                        <Icon
                            name="close_icons_campaignSearch datepicker_close_icon"
                            onClick={onChange}
                        />
                    )}
                    <i aria-hidden="true" class="calendar icon" onClick={onClick}></i>
                </Fragment>
            )}
            readOnly
        />
    );

    return (
        <DatePicker
            selected={dateValue}
            onChange={date => handleonDateChange(date, name)}
            customInput={<DatePickerCustomInput />}
            showPopperArrow={false}
            dateFormat="yyyy-MM-dd"
            strictParsing
            minDate={new Date(minDateFormat)}
        />
    );
}
ChimpDatePicker.defaultProps = {
    handleonDateChange: () => { },
    dateValue: null,
}
export default React.memo(ChimpDatePicker);
