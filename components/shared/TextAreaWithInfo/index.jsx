import {
    string,
} from 'prop-types';
import React, {
    Fragment,
} from 'react';


/**
 * A custom `control` for SUIR.Form.TextField.
 *
 * Supplying this as a control enables the div.field-info to exist inside the container of the
 * injected textarea, allowing their positioning to be better matched. `className="with-info"`
 * **MUST** be added to the `Form.TextField`.
 * @param  {string}  props.info A localised string to be added near the textarea (ex 10 of 100
 * characters)
 * @param  {any}     props      All other props that were passed to Form.TextField
 * @return {JSX}                The textarea and the localised string.
 */
const TextAreaWithInfo = ({
    info,
    ...rest,
}) => (
    <Fragment>
        <textarea {...rest} rows={3} />
        <div className="field-info">{info}</div>
    </Fragment>
);
TextAreaWithInfo.propTypes = {
    info: string.isRequired,
};

export default TextAreaWithInfo;
