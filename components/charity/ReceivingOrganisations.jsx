import React from 'react';
import { connect } from 'react-redux';
import {
    Table,
} from 'semantic-ui-react';

class ReceivingOrganisations extends React.Component {
    constructor(props) {
        super(props);
        console.log("ReceivingOrganisations component props");
    }

    static showList(list) {
        return (
            list.map((donee) => (
                <Table.Row>
                    <Table.Cell>{donee.donee_name}</Table.Cell>
                    <Table.Cell className="bold">{donee.gifts_total}</Table.Cell>
                </Table.Row>
            )));
    }

    render() {
        const {
            donationDetails,
        } = this.props;
        return (
            <Table basic="very" className="no-border-table">
                <Table.Body>
                    {(donationDetails && donationDetails.donationDetails && donationDetails.donationDetails._embedded
                    && ReceivingOrganisations.showList(donationDetails.donationDetails._embedded.donee_list)
                    )}
                </Table.Body>
                <Table.Footer className="brdr-footer">
                    <Table.Row>
                        {/* <Table.Cell>118 gifts to qualified organizations totalled</Table.Cell>
                        <Table.Cell className="bold">$14,234,189.0</Table.Cell> */}
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}

function mapStateToProps(state) {
    return {
        donationDetails: state.charity.donationDetails,
    };
}

export default connect(mapStateToProps)(ReceivingOrganisations);
