import React from 'react';
import DatePicker from "react-datepicker";
import {
    Input,
    Form,
} from 'semantic-ui-react';
import "../../../static/less/datePicker.less";

function ChimpDatePicker(props) {

    const DatePickerCustomInput = ({onChange, value, onClick}) => (
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
            selected={props.dateValue} 
            onChange={props.onChangeValue}
            customInput={<DatePickerCustomInput />}
            showPopperArrow={false}
            dateFormat="yyyy/MM/dd"
            strictParsing
        />
    )
}

export default ChimpDatePicker;