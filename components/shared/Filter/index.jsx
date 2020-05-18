import React, { Fragment } from 'react';
import _map from 'lodash/map';
import _concat from 'lodash/concat';
import {
    Button,
    Menu,
    Accordion,
    Form,
    Popup,
    Grid,
} from 'semantic-ui-react';

import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _fromPairs from 'lodash/fromPairs';
import {
    connect,
} from 'react-redux';
import FilterItems from './FilterItems';

const generateFilterObj = (obj) => {
    const finalObjects = [];
    Object.entries(obj).map(([
        field,
        value,
    ]) => {
        if (!_isEmpty(value)) {
            if (field === 'categories') {
                finalObjects.push({
                    field: 'causes.display_name',
                    value,
                });
            }
            if (field === 'location') {
                finalObjects.push({
                    field: 'city',
                    value,
                });
            }
            if (field === 'Charity designation') {
                finalObjects.push({
                    field: 'designation',
                    value,
                });
            }
            if (field === 'Charity Size') {
                finalObjects.push({
                    field: 'charity_size',
                    value,
                });
            }
            if (field === 'Giving Group types') {
                finalObjects.push({
                    field: 'group_Type',
                    value,
                });
            }
            if (field === 'Language') {
                finalObjects.push({
                    field: 'language',
                    value,
                });
            }
        }
    });
    return finalObjects;
};

class FilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1,
            filterObj: {},
            isOpen: false,
        };
        let filterDataLocal = [];
        if (!_isEmpty(props.filterData)) {
            filterDataLocal = [...props.filterData];
            //Here  filter data have fields as key so mapping fields to corresponding local filter conent key value from api so 
            //that we can append filterObj object when we add or remove object when clicking apply filters.
            filterDataLocal.forEach((filter) => {
                let key = Object.values(filter)[0];
                let value = Object.values(filter)[1];
                if (key === 'causes.display_name') {
                    key = 'categories';
                }
                if (key === 'city') {
                    key = 'location';
                }
                if (key === 'designation') {
                    key = 'Charity designation';
                }
                if (key === 'charity_size') {
                    key = 'Charity Size';
                }
                if (key === 'group_Type') {
                    key = 'Giving Group types';
                }
                if (key === 'language') {
                    key = 'Language';
                }
                this.state.filterObj[key] = value;
            });
        } else {
            this.state.filterObj = {};
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.SizeForm = this.SizeForm.bind(this);
        this.renderFilterData = this.renderFilterData.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCheckBoxClicked = this.handleCheckBoxClicked.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleCancel() {
        this.setState({ filterObj: {}, isOpen: false });
    }

    SizeForm(FilterValues, filterHeader) {
        const {
            filterObj
        } = this.state;
        return (
            <Form>
                <Form.Group grouped>
                    {
                        FilterValues.map((filterValue) => {
                            return (
                                <FilterItems
                                    filterValue={filterValue}
                                    filterHeader={filterHeader}
                                    checkedParent={(!_isEmpty(filterObj[filterHeader]) && filterObj[filterHeader].includes(filterValue.key)) ? true : false}
                                    handleCheckBoxClickedChild={this.handleCheckBoxClicked}
                                />
                            );
                        })
                    }
                </Form.Group>
            </Form>
        );
    }

    handleCheckBoxClicked(event, filterValue) {
        const {
            activeIndex,
        } = this.state;
        const filterObj = _cloneDeep(this.state.filterObj)
        const {
            FilterHeaders,
        } = this.props;
        const field = FilterHeaders[activeIndex];
        if (event.target.checked === true) {
            if (!filterObj[field]) {
                filterObj[field] = [];
            }
            if (filterObj[field]) {
                if (filterObj[field].includes(filterValue)) {
                    const index = filterObj[field].indexOf(filterValue);
                    filterObj[field].splice(index, 1);
                } else {
                    filterObj[field].push(filterValue);
                }
            }
        } else {
            const index = filterObj[field].indexOf(filterValue);
            filterObj[field].splice(index, 1);
        }
        this.setState({ filterObj });
    }

    handleClick(e, titleProps) {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    handleApplyFilter() {
        const results = generateFilterObj(this.state.filterObj);
        let finalFilterObjDispactched = null;
        if (!_isEmpty(results) && !_isEmpty(Object.keys(results))) {
            //This condition prevents sending empty values for a key
            finalFilterObjDispactched = results.filter((result) => {
                if (result && result.value.length > 0) {
                    return result;
                }
            });
            this.props.dispatch({
                payload: {
                    filterData: finalFilterObjDispactched,
                },
                type: 'DISPATCH_FILTER_DATA',
            });
        } else {
            this.props.dispatch({
                payload: {
                    filterData: [],
                },
                type: 'DISPATCH_FILTER_DATA',
            });
        }
    }

    renderFilterData(FilterHeaders, FilterValues) {
        const { activeIndex } = this.state;
        let renderFilterComponent = null;
        if (!_isEmpty(FilterHeaders)) {
            renderFilterComponent = FilterHeaders.map((filterHeader, i) => {
                return (
                    <Menu.Item key={i}>
                        <Accordion.Title
                            active={activeIndex === i}
                            content={filterHeader.charAt(0).toUpperCase() + filterHeader.slice(1, filterHeader.length)}
                            index={i}
                            onClick={this.handleClick}
                        />
                        <Accordion.Content active={activeIndex === i} content={this.SizeForm(FilterValues[i], filterHeader)} />
                    </Menu.Item>
                );
            });
        }

        return renderFilterComponent;
    }
    handleOpen = () => {
        this.setState({ isOpen: true })
    }

    render() {
        const {
            FilterHeaders,
            FilterValues,
        } = this.props;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={5} tablet={4} computer={4}>

                        <Popup
                            basic
                            className="filterPopup"
                            on="click"
                            open={this.state.isOpen}
                            onClose={this.handleCancel}
                            onOpen={this.handleOpen}
                            pinned
                            position="bottom right"
                            trigger={<div className="paginationWraper"><div className="text-right" ><a className="filterLink">Filter</a></div></div>}
                        >
                            <div className="filterPanel">
                                <div className="filterPanelContent">
                                    <div className="filterPanelItem">
                                        <div className="filter-header font-18 font-bold">Filter by</div>
                                        <Accordion as={Menu} vertical>
                                            {this.renderFilterData(FilterHeaders, FilterValues)}
                                        </Accordion>
                                    </div>
                                </div>
                                <div className="panel-footer text-right">
                                    <Button className="rounded-btn" onClick={this.handleCancel}>Cancel</Button>
                                    <Button className="blue-btn-rounded" primary onClick={this.handleApplyFilter}>Apply Filters</Button>
                                </div>
                            </div>
                        </Popup>
                    </Grid.Column>

                </Grid.Row>
            </Grid>

        );
    }
}
const mapStateToProps = (state) => ({
    filterData: state.search.filterData,
});
export default (connect(mapStateToProps)(FilterComponent));
