import React from 'react';
import {
  Button,
  Container,
  Header,
  Icon,
  Image,
  Menu,
  Responsive,
  Form,
  Input,
  Dropdown,
  Divider,
  Segment,
  Visibility,
  Grid,
  List,
  Card,
  Breadcrumb,
} from 'semantic-ui-react'
import {reInitNextStep, proceed} from '../../actions/give';

const square = { width: 175, height: 175 }
class Review extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const {dispatch, flowObject} = this.props
    if (flowObject) {
        reInitNextStep(dispatch, flowObject)
    }
  }
  handleSubmit = () => {
    const {dispatch, stepIndex, flowSteps, flowObject} = this.props
    dispatch(proceed(flowObject, flowSteps[stepIndex+1], true))
  }
  render() {
    return (
      <div className="pageWraper">
        <Container>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={12}>
                <div className="pageHeader">
                <Grid columns={2} verticalAlign='middle'>
                  <Grid.Row>
                    <Grid.Column >
                      <Header as='h2'>Review</Header>
                    </Grid.Column>
                    <Grid.Column >
                      <Breadcrumb floated='right'>
                        <Breadcrumb.Section link>Give</Breadcrumb.Section>
                        <Breadcrumb.Divider icon='triangle right' />
                        <Breadcrumb.Section link>Review</Breadcrumb.Section>
                        <Breadcrumb.Divider icon='triangle right' />
                        <Breadcrumb.Section active>Confirmation</Breadcrumb.Section>
                      </Breadcrumb>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                </div>
                <div className="pageSubHeader">
                  <Header as='h3'>Review</Header>
                </div>
                <div className="reviewWraper">
                  <Grid stackable columns={3}>
                    <Grid.Row>
                      <Grid.Column >
                        <Header as='h2'>From</Header>
                        <div className="review-list-wraper" >
                          <List className="review-list" celled>
                            <List.Item>
                              <List.Content className="list-img">
                                <Icon  name="credit card outline"/>
                              </List.Content>
                              <List.Content>
                                Hopes Kerby's Visa ending with 4242 account ($3.70)
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content className="list-img">
                                <Icon  name="credit card outline"/>
                              </List.Content>
                              <List.Content>
                                Hopes account ($3.70)
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content className="list-img">
                                <Icon name="cc visa"/>
                              </List.Content>
                              <List.Content>
                                Shady Potatos ($3.70)
                              </List.Content>
                            </List.Item>
                          </List>
                        </div>
                      </Grid.Column>

                      <Grid.Column textAlign='center' verticalAlign='middle'>
                        <div className="circle-wraper">
                          <div className='center-table'>
                            <Segment textAlign='center' circular style={square}>
                              <Header as='h2'>
                                Give
                                <Header.Subheader>$1,280.66</Header.Subheader>
                              </Header>
                            </Segment>
                          </div>
                        </div>
                      </Grid.Column>

                      <Grid.Column >
                        <Header as='h2'>To</Header>
                        <div className="review-list-wraper">
                          <List className="review-list single" celled>
                            <List.Item>
                              <List.Content className="list-img">
                                <Icon  name="user"/>
                              </List.Content>
                              <List.Content>
                                Hopes account($3.70)
                              </List.Content>
                            </List.Item>

                          </List>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              </Grid.Column>


              <Grid.Column mobile={16} tablet={16} computer={4}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Help Center</Card.Header>
                  </Card.Content>
                  <Card.Content extra>
                    <Button as='a' fluid className="btn-outline-primary">Search The Help Center</Button>
                    <List>
                      <List.Item>
                        <List.Icon name='mail' />
                        <List.Content>
                          <a href='mailto:'>Email us</a>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name='chat' />
                        <List.Content>
                          <a href='mailto:'>Chat online with us</a>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name='phone' />
                        <List.Content>
                          <a href='mailto:'>Call us: 1-888-123-000</a>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}


export default Review;
