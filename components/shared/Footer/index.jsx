import PropTypes from 'prop-types'
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
} from 'semantic-ui-react'

const options = [
  {
    key: 'english',
    text: 'English',
    value: 'english',
    content: 'English',
  },
  {
    key: 'french',
    text: 'French',
    value: 'french',
    content: 'French',
  },
]
const Footer = (props,mobile) => (
  <Segment className="c-global-footer" vertical style={{ padding: '2em 0em' }}>
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            <Responsive minWidth={Responsive.onlyMobile.maxWidth}>
            <Grid stackable>
              <Grid.Row columns={5}>
                <Grid.Column >
                    <Header as='h4' content='Features' />
                    <List link>
                      <List.Item as='a'>Fundraising</List.Item>
                      <List.Item as='a'>Ways to give</List.Item>
                      <List.Item as='a'>Community</List.Item>
                      <List.Item as='a'>Accounts</List.Item>
                      <List.Item as='a'>Fees</List.Item>
                      <List.Item as='a'>Trust</List.Item>
                    </List>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h4' content='Solutions' />
                  <List link>
                    <List.Item as='a'>Individuals</List.Item>
                    <List.Item as='a'>Groups</List.Item>
                    <List.Item as='a'>Workplace</List.Item>
                    <List.Item as='a'>Philanthropists</List.Item>
                    <List.Item as='a'>Education</List.Item>
                    <List.Item as='a'>Sports</List.Item>
                    <List.Item as='a'>Funding</List.Item>
                    <List.Item as='a'>Organizations</List.Item>
                    <List.Item as='a'>Charities</List.Item>
                    <List.Item as='a'>Events</List.Item>
                    <List.Item as='a'>Families</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h4' content='About' />
                  <List link>
                    <List.Item as='a'>About Us</List.Item>
                    <List.Item as='a'>Our Story</List.Item>
                    <List.Item as='a'>Team</List.Item>
                    <List.Item as='a'>Press</List.Item>
                    <List.Item as='a'>Charitable impact Foundation</List.Item>
                    <List.Item as='a'>Careers</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h4' content='Support' />
                  <List link>
                    <List.Item as='a'>Contact Us</List.Item>
                    <List.Item as='a'>Help Center</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h4' content='Blog' />
                  <List link>

                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            </Responsive>
          </Grid.Column>
          <Grid.Column width={4}>
            <Header as='h4'>
              Follow us
            </Header>
            <List className="footer-social" horizontal link>
              <List.Item as='a'><Icon name='twitter'/></List.Item>
              <List.Item as='a'><Icon name='facebook'/></List.Item>
              <List.Item as='a'><Icon name='instagram'/></List.Item>
              <List.Item as='a'><Icon name='vimeo v'/></List.Item>
            </List>
            <Header as='h4'>
              <List link>
                <List.Item as='a'>Parlez-vous français?<Icon style={{marginLeft:'2px'}} name='triangle right'/></List.Item>
              </List>
            </Header>
            <Header as='h4'>
              Subscribe
            </Header>
            <List>
              <p>Subscribe to our mailing list to get updates to your email inbox</p>
              <Form size="small">
                <Form.Field>
                  <input placeholder='Enter your email address' />
                </Form.Field>
                <Button style={{
        fontSize: mobile ? '' : '',}} size="small" color="blue" type='submit'>Submit</Button>
              </Form>
            </List>
            <Header as='h4'>
              Language
            </Header>
            <div >
              <Icon name='world' />
                <Dropdown
                  inline
                  options={options}
                  defaultValue={options[0].value}
                />
            </div>
          </Grid.Column>
        </Grid.Row>
        <Divider/>

        <Grid.Row columns={2}>
          <Grid.Column>
          <List horizontal link>
            <List.Item as='a'>Privacy</List.Item>
            <List.Item as='a'>Terms</List.Item>
            <List.Item as='a'>Account Agreement</List.Item>
          </List>
          <p>&copy; Copyright 2018 CHIMP Technology Inc. - All Rights Reserved.</p>
          </Grid.Column>
          <Grid.Column>
          </Grid.Column>
        </Grid.Row>


      </Grid>
    </Container>
  </Segment>
);
Footer.propTypes = {
  mobile: PropTypes.bool,
}
export default Footer;
