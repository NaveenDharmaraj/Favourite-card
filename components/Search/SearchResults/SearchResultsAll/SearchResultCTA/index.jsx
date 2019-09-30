import React, { Fragment } from 'react';
import {
    Header,
    Menu,
    Grid,
    Input,
    Card,
    Image,
    Button,
    Icon
} from 'semantic-ui-react'

// eslint-disable-next-line react/prefer-stateless-function
class SearchResultCTA extends React.Component {
    render() {
        return (

            <div className="cta-add">
                <Grid stackable>
                    <Grid.Row stretched>
                        <Grid.Column mobile={16} tablet={12} computer={13}>
                            <div className="cta-add-details">
                                <p>Don't miss amazing content something</p>
                                <Header as="h2">Prompt, i.e. Connect with your friends</Header>
                            </div>
                        </Grid.Column>
                        <Grid.Column textAlign="center" verticalAlign="middle" mobile={16} tablet={4} computer={3}>
                            <div className="btn-wraper">
                                <Button className="view-btn">CTA</Button>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default SearchResultCTA;
