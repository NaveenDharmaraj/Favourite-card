import React, { Fragment } from 'react';
import {
    Button,
    Menu,
    Accordion,
    Form,
    Popup,
    Grid,
} from 'semantic-ui-react';

class FilterItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedState: props.checkedParent,
        };
        this.handleCheckBoxClicked = this.handleCheckBoxClicked.bind(this);
    }

    handleCheckBoxClicked(e, filterValue) {
        const {
            checkedState,
        } = this.state;
        this.props.handleCheckBoxClickedChild(e, filterValue);
        this.setState({
            checkedState: !checkedState,
        });
    }

    render() {
        const {
            filterHeader,
            filterValue,
        } = this.props;
        const {
            checkedState,
        } = this.state;
        const idValue = `${filterValue.key}+${filterHeader}`;
        return(
            <Fragment>
                <Form.Checkbox checked={checkedState} label={`${filterValue.key} (${filterValue.doc_count})`} id={idValue} name={filterValue.key} value={filterValue.key} onClick={(e) => { this.handleCheckBoxClicked(e, filterValue.key); }} />
            </Fragment>
        );
    }
}

export default FilterItems;
