/* eslint-disable react/prop-types */
import React from 'react';
import {
    Button,
    Container,
    Header,
    Grid,
    Card,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { Link } from '../../../routes';
import { withTranslation } from '../../../i18n';
import {
    formatCurrency,
} from '../../../helpers/give/utils';

// eslint-disable-next-line react/prefer-stateless-function
class AccountBalance extends React.Component {
    render() {
        const {
            currentUser,
            i18n: {
                language,
            },
        } = this.props;
        const amount = formatCurrency(currentUser.attributes.balance, language, 'USD');
        return (
            <div>
                <div className="c-db-header">
                    <Container>
                        <Header as="h3">
                            Your Impact Account
                        </Header>
                    </Container>
                </div>
                <div className="pt-3 pb-3">
                    <Container>
                        <Grid stackable>
                            <Grid.Row stretched>
                                <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <Card fluid className="db-card db-card-blue">
                                        <Card.Content>
                                            <Grid verticalAlign="middle">
                                                <Grid.Row>
                                                    <Grid.Column
                                                        mobile={10}
                                                        tablet={10}
                                                        computer={11}
                                                    >
                                                        <Header as="h2" className="txt-white">
                                                            <Header.Content>
                                                                <Header.Subheader>
                                                                        Impact Account Balance
                                                                </Header.Subheader>
                                                                {amount}
                                                            </Header.Content>
                                                        </Header>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={6} tablet={6} computer={5}>
                                                        <Link className="lnkChange" route="/donations/new">
                                                            <Button className="btn-small-white">Add funds</Button>
                                                        </Link>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={8} computer={8}>
                                    <Card fluid className="db-card db-card-red">
                                        <Card.Content>
                                            <Grid verticalAlign="middle">
                                                <Grid.Row>
                                                    <Grid.Column
                                                        mobile={10}
                                                        tablet={11}
                                                        computer={11}
                                                    >
                                                        <Header as="h3" className="txt-white">
                                                            <Header.Content>
                                                            Send a gift to someone
                                                            </Header.Content>
                                                        </Header>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={6} tablet={5} computer={5}>
                                                        <Link className="lnkChange" route="/give/to/friend/new">
                                                            <Button className="btn-small-white">Create gift</Button>
                                                        </Link>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
            </div>
        );
    }
}

AccountBalance.propTypes = {
    currentUser: PropTypes.object,
};

export default withTranslation()(AccountBalance);
