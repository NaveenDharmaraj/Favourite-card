import React, {
    Component,
    Fragment,
} from 'react';
import {
    Accordion, Checkbox, Form, Header, Input, Segment,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

class DedicateGift extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1,
            currentName: !_isEmpty(props.dedicateType) ? props.dedicateType : '',
        };
        if (props.dedicateType === 'inHonorOf') {
            this.state.activeIndex = 0;
        } else if (props.dedicateType === 'inMemoryOf') {
            this.state.activeIndex = 1;
        }
    }

    handleOnInputChangeWrapper(event, titleProps) {
        const {
            index, value,
        } = titleProps;
        const {
            handleInputChange,
        } = this.props;
        const { activeIndex } = this.state;
        let { currentName } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        if (index === 0) {
            currentName = 'inHonorOf';
        } else if (index === 1) {
            currentName = 'inMemoryOf';
        }
        const name = currentName;
        handleInputChange(event, {
            name,
            newIndex,
            value,
        });
        this.setState({
            activeIndex: newIndex,
            currentName,
        });
    }

    render() {
        const {
            activeIndex,
            currentName,
        } = this.state;
        const {
            dedicateValue,
            handleInputChange,
            handleInputOnBlur,
            validity,
        } = this.props;
        return (
            <Fragment>
                <div className="give_flow_field">
                    <Header as="h3" className="f-weight-n">
                        Dedicate this gift (optional)
                    </Header>
                    <Accordion>
                        <Accordion.Title
                            as={Checkbox}
                            checked={activeIndex === 0}
                            label="In honour of"
                            name="inHonorOf"
                            className="cp_chkbx round font-w-n mb-1"
                            value={dedicateValue}
                            index={0}
                            onClick={(e, data) => { this.handleOnInputChangeWrapper(e, data); }}
                        />
                        <br />
                        <Accordion.Title
                            as={Checkbox}
                            checked={activeIndex === 1}
                            label="In memory of"
                            name="inMemoryOf"
                            className="cp_chkbx round font-w-n"
                            value={dedicateValue}
                            index={1}
                            onClick={(e, data) => { this.handleOnInputChangeWrapper(e, data); }}
                        />
                        <Accordion.Content
                            as={Input}
                            className="inputInline"
                            active={activeIndex === 0 || activeIndex === 1}
                            name={currentName}
                            placeholder="Who are you dedicating this gift to? "
                            onChange={(e, {
                                name, newIndex, value,
                            }) => {
                                handleInputChange(e, {
                                    name,
                                    newIndex,
                                    value,
                                });
                            }}
                            onBlur={(e) => {
                                const name = currentName;
                                handleInputOnBlur(e, {
                                    name,
                                    dedicateValue,
                                });
                            }}
                            value={dedicateValue}
                        />

                    </Accordion>
                    <FormValidationErrorMessage
                        condition={validity && !validity.isDedicateGiftEmpty}
                        errorMessage="Add a note to remember who you've dedicated this gift to."
                    />
                </div>
            </Fragment>
        );
    }
}

DedicateGift.propTypes = {
    dedicateType: PropTypes.string,
    dedicateValue: PropTypes.string,
    handleInputChange: PropTypes.func,
};

DedicateGift.defaultProps = {
    dedicateType: '',
    dedicateValue: '',
    handleInputChange: () => {},
};


export default DedicateGift;
