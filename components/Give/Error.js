
import { Grid,Icon,Button } from 'semantic-ui-react';
import { Link } from '../../routes';

const Error = ()=> {
    return (
    <div>
      <Grid
                className="u-margin-bottom-lg u-margin-top-lg"
                container
                columns={2}
            >
                <Grid.Column
                    mobile={16}
                    computer={12}
                >
                    <Grid>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column>
                            <Icon color='red' size='big' name='exclamation triangle' />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column>
                                <p
                                    className="error-heading"
                                >
                                  "Uh oh, it looks like something went wrong."
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column>
                                <div
                                    className="error-message"
                                >
                                    <p>
                                    "Unfortunately, we couldn't complete this transaction because of an error with our system. Please contact us before you try the transaction again: 
                                    <a href="mailto:hellochimp.net">hello@chimp.net</a> or <a href="tel:+18775310580">+1 (877) 531-0580</a>."
                                    </p>
                                    <p>
                                        "We're sorry for the inconvenience, and we're here to help."
                                    </p>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                            textAlign="center"
                        >
                            <Grid.Column
                                className="error-message"
                            >
                                <Link route='/' >
                                <Button 
                                color="blue"
                                content="Go back to your dashboard"
                                />
                                </Link>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid>
    </div>
    )
  }
  
export default Error;