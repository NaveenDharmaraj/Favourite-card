import React, { Fragment } from 'react';
import {
    Button,
    Grid,
    Icon,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import PropTypes from 'prop-types';

import TaxReceipientCard from '../TaxReceipientCard';
import {
    getTaxReceiptProfilePaginated,
} from '../../../actions/taxreceipt';
import PlaceholderGrid from '../../shared/PlaceHolder';
import NoTaxReceipts from '../../TaxReceipt/NoTaxReceipts';

class TaxReceipientsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMoreIncrementor: 1,
            loadMoreLoader: false,
        };
        this.onPageChanged = this.onPageChanged.bind(this);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        getTaxReceiptProfilePaginated(dispatch, id, 1);
    }


    componentDidUpdate(prevProps) {
        const {
            taxReceiptProfileList,
        } = this.props;
        let {
            loadMoreLoader,
        } = this.state;
        if (!_.isEqual(this.props, prevProps)) {
            if (!_isEqual(taxReceiptProfileList, prevProps.taxReceiptProfileList)) {
                loadMoreLoader = false;
            }
            this.setState({
                loadMoreLoader,
            });
        }
    }

    onPageChanged() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            taxReceiptProfilePageCount,
        } = this.props;

        let {
            loadMoreIncrementor,
        } = this.state;
        if (loadMoreIncrementor < taxReceiptProfilePageCount) {
            loadMoreIncrementor += 1;
            getTaxReceiptProfilePaginated(dispatch, id, loadMoreIncrementor, true);
            this.setState({
                loadMoreIncrementor,
                loadMoreLoader: true,
            });
        }
    }

    render() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            loader,
            taxReceiptProfileList,
            taxReceiptProfilePageCount,
        } = this.props;
        const {
            loadMoreIncrementor,
            loadMoreLoader,
        } = this.state;
        return (
            <Fragment>
                {loader ? <PlaceholderGrid row={2} column={2} /> : (
                    <Fragment>
                        {(!_isEmpty(taxReceiptProfileList) && taxReceiptProfileList.length > 0)
                            ? (
                                <Grid verticalAlign="middle" stackable>
                                    <Grid.Row>
                                        {_map(taxReceiptProfileList.slice(0, 4), (taxReceipt) => (
                                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                                <TaxReceipientCard taxReceipt={taxReceipt} id={id} dispatch={dispatch} />
                                            </Grid.Column>
                                        ))
                                        }
                                    </Grid.Row>
                                </Grid>

                            )
                            : (
                                <Fragment>
                                    <NoTaxReceipts />
                                    <br />

                                </Fragment>
                            )
                        }

                        {(!_isEmpty(taxReceiptProfileList) && taxReceiptProfileList.length > 4)
                    && (
                        <div className="text-center mt-1 mb-1">
                            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<Button className="blue-bordr-btn-round-def c-small">Manage recipients</Button>}>
                                <Modal.Header>Manage recipients</Modal.Header>
                                <Modal.Content className="scrollContent">
                                    {
                                        taxReceiptProfileList.map((taxReceipt) => (
                                            <TaxReceipientCard taxReceipt={taxReceipt} id={id} dispatch={dispatch} />
                                        ))}
                                </Modal.Content>
                                {
                                    loadMoreIncrementor < taxReceiptProfilePageCount && (
                                        <Modal.Content>
                                            <div className="text-center">
                                                {
                                                    loadMoreLoader ? <Icon name="spinner" loading /> : <Button className="blue-bordr-btn-round-def" onClick={()=>{this.onPageChanged()}}> Load More </Button>
                                                }
                                            </div>
                                        </Modal.Content>
                                    )
                                }
                            </Modal>
                        </div>
                    )
                        }
                    </Fragment>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    loader: state.taxreceipt.loader,
    taxReceiptProfileList: state.taxreceipt.taxReceiptProfileList,
    taxReceiptProfilePageCount: state.taxreceipt.taxReceiptProfilePageCount,
});

TaxReceipientsList.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.string,
    }),
    dispatch: PropTypes.func,
    taxReceiptProfileList: PropTypes.arrayOf({
        data: PropTypes.shape({
            id: PropTypes.string,
        }),
    }),
    taxReceiptProfilePageCount: PropTypes.number,
};

TaxReceipientsList.defaultProps = {
    currentUser: {
        id: null,
    },
    dispatch: () => {},
    taxReceiptProfileList: null,
    taxReceiptProfilePageCount: 1,
};

export default connect(mapStateToProps)(TaxReceipientsList);
