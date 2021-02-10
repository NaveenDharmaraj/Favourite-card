import React from 'react';
import DatePicker from "react-datepicker";
import {
    Input,
    Form,
} from 'semantic-ui-react';
import "../../../static/less/datePicker.less";

function ChimpDatePicker({ handleonDateChange, dateValue, name }) {

    const DatePickerCustomInput = ({ onChange, value, onClick }) => (
        <Form.Field
            control={Input}
            placeholder='yyyy-mm-dd'
            onChange={onChange}
            value={value}
            icon={<i aria-hidden="true" class="calendar icon" onClick={onClick}></i>}
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
        />
    )
}
ChimpDatePicker.defaultProps = {
    handleonDateChange: () => { },
    dateValue: null,
}
export default React.memo(ChimpDatePicker);