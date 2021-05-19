import DatePicker from 'react-datepicker';
import {
    Input,
    Form,
    Icon
} from 'semantic-ui-react';
import '../../../static/less/datePicker.less';
function ChimpDatePicker(props) {
    const currentDate = new Date();
    const minDateFormat = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`
    const DatePickerCustomInput = ({ value, onChange, onClick }) => (
        <Form.Field>
            <Input placeholder='MM, DD YYYY' onChange={onChange} value={value} onBlur={(e) => props.onChangeValue(e.target.value)} disabled />
            <Icon
                class="calendar icon"
                name="calendar icon"
                onClick={onClick}
                aria-hidden="true"
            />
        </Form.Field>
    );

    return (
        <DatePicker
            selected={props.dateValue}
            onChange={(date) => props.onChangeValue(date)}
            customInput={<DatePickerCustomInput />}
            showPopperArrow={false}
            dateFormat="MMMM d, yyyy"
            strictParsing
            popperPlacement="bottom-end"
            minDate={new Date(minDateFormat)}
        />
    )
}

export default ChimpDatePicker;