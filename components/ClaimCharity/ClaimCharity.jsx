import React, { Fragment } from 'react';
import {
    Container,
    Header,
    Grid,
    Image,
    Input,
    Form,
    Button,
    Item,
    List,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import claimrLeftImg from '../../static/images/claimcharity02.svg';
import customizeIcons1 from '../../static/images/icons/wedontsetorbenefitfromprocessingfee@3x.svg';
import customizeIcons2 from '../../static/images/icons/icon-2@3x.svg';
import customizeIcons3 from '../../static/images/icons/icon-2-1@3x.svg';
import customizeIcons4 from '../../static/images/icons/processingfee@3x.svg';
import '../../static/less/claimcharity.less';
import { connect } from 'react-redux';
import { checkClaimCharityAccessCode, validateClaimCharityAccessCode, claimCharityErrorCondition } from '../../actions/user';
import FormValidationErrorMessage from '../../components/shared/FormValidationErrorMessage';

class ClaimCharity extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            accessCode: '',
        }
    }

    handleInputChange = (event, data) => {
        const { dispatch, claimCharityErrorMessage } = this.props;
        const { value } = data;
        this.setState({
            accessCode: value,
        });
        const errorMessage = '';
        !_isEmpty(claimCharityErrorMessage) && dispatch(
            claimCharityErrorCondition(errorMessage)
        );
    }

    onClaimCharityClick = () => {
        const {
            currentUser,
            dispatch,
            isAuthenticated,
        } = this.props;
        const { accessCode } = this.state;
        this.setState({
            buttonClicked: true,
            loader: true,
        });
        if (isAuthenticated) {
            dispatch(checkClaimCharityAccessCode(accessCode, currentUser.id))
                .then(() => {
                    this.setState({
                        buttonClicked: false,
                        loader: false,
                    })
                })
        }
        else {
            dispatch(validateClaimCharityAccessCode(accessCode)).then(() => {
                this.setState({
                    buttonClicked: false,
                    loader: false,
                })
            });
        }
    }

    render() {
        const {
            claimCharityErrorMessage
        } = this.props;
        const { buttonClicked, loader } = this.state;
        return (
            <Fragment>
                <div className="ClaimWepper">
                    <Container>
                        <div className="Claimheading">
                            <Header as='h3'>Claim your charity</Header>
                        </div>
                        <div className="giftsFaster">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={16} computer={8} className="myRedDIV order-2">
                                        <div className="Giftsleft">
                                            <div className="GiftsleftHeading">
                                                <Header as='h3'>Get gifts faster and customize your charity page</Header>
                                            </div>
                                            <Item.Group>
                                                <Item>
                                                    <Image src={customizeIcons1} />
                                                    <Item.Content>
                                                        <Item.Description>
                                                            <p>Set up direct deposit and receive gifts on a weekly basis, rather than twice monthly by cheque</p>
                                                        </Item.Description>
                                                    </Item.Content>
                                                </Item>
                                                <Item>
                                                    <Image src={customizeIcons2} />
                                                    <Item.Content>
                                                        <Item.Description>
                                                            <p> Edit your charity description, contact information, and logo on your charity page</p>
                                                        </Item.Description>
                                                    </Item.Content>
                                                </Item>
                                                <Item>
                                                    <Image src={customizeIcons3} />
                                                    <Item.Content>
                                                        <Item.Description>
                                                            <p> Get notified when you receive a gift from a donor, and immediately thank those who give to you</p>
                                                        </Item.Description>
                                                    </Item.Content>
                                                </Item>
                                                <Item>
                                                    <Image src={customizeIcons4} />
                                                    <Item.Content>
                                                        <Item.Description>
                                                            <p> Download monthly transaction reports to see gift details</p>
                                                        </Item.Description>
                                                    </Item.Content>
                                                </Item>
                                            </Item.Group>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={16} computer={8} className="myPinkDIV order-1">
                                        <div className="RightImg">

                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>

                    </Container>
                    <div className="claimBg">
                        <Container>
                            <div className="Claimheading">
                                <Header as='h3'>How to claim your charity page</Header>
                            </div>
                            <div className="access">
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <div className="LeftImg">
                                                <Image src={claimrLeftImg} />
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={8} computer={8}>
                                            <div className="accessRight">
                                                <div className="subHeading">
                                                    <Header as='h4'>With an access code</Header>
                                                </div>
                                                <div className="subText">
                                                    <p>Enter your charity's access code. This code is included in the letter you receive when gifts are sent to your charity on Charitable Impact. Please make sure to use the access code on the most recent letter you've received from us.</p>
                                                </div>
                                                <div className="Accessinput">
                                                    <Grid>
                                                        <Grid.Row>
                                                            <Grid.Column mobile={16} tablet={16} computer={9}>
                                                                <Form>
                                                                    <label className="accesslabel">Access code</label>
                                                                    <Form.Field
                                                                        data-test="ClaimCharity_ClaimCharity_accesscode_input"
                                                                        error={claimCharityErrorMessage? true : false}
                                                                        control={Input}
                                                                        id="accessCode"
                                                                        name="accessCode"
                                                                        className="inputBox"
                                                                        placeholder="eg.: 269-showd-rasse-nebek-430"
                                                                        onChange={this.handleInputChange}
                                                                    />
                                                                    <FormValidationErrorMessage
                                                                        data-test="ClaimCharity_ClaimCharity_errormessage_validation"
                                                                        className="mt-0"
                                                                        condition={claimCharityErrorMessage? true : false}
                                                                        errorMessage={claimCharityErrorMessage? claimCharityErrorMessage : ''}
                                                                    />
                                                                </Form>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={12} computer={7}>
                                                                <Button
                                                                    data-test="ClaimCharity_ClaimCharity_claimbutton"
                                                                    className="primary blue-btn-rounded btnTextsize mt-2"
                                                                    onClick={this.onClaimCharityClick}
                                                                    disabled={buttonClicked}
                                                                    loading ={loader}
                                                                > Claim your charity </Button>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </div>

                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </div>
                        </Container>
                    </div>
                    <div className="WithoutAccess">
                        <Container>
                            <div className="WithoutAccessheading">
                                <Header as='h3'>Without an access code</Header>
                            </div>
                            <List>
                                <List.Item className="number">Email us at <a className="linkEmail" href={`mailto:hello@charitableimpact.com`} target='_blank'>hello@charitableimpact.com</a> with the name and registration number of the charity you wish to claim.</List.Item>
                                <List.Item className="number serchiconleft">
                                    We complete a manual verification process in order to grant administrative privileges to the charity profile. To speed up the process, please ensure that you provide us with one of the following pieces of information:
                                <List.List>
                                        <List.Item>a) An email that is listed on your charity's Canadian Revenue Agency (CRA) profile online as the ???Charity Email Address???.</List.Item>
                                        <List.Item>b) A link to the charity???s official website that confirms your email???s association with the charity. This website should be displayed on CRA???s listing for your charity as the ???Charity Website Address???.</List.Item>
                                        <List.Item>c) A letter signed by a current Director/Trustee that authorizes your email to access the charity profile. (Please note that the Director/Trustee must be named on the most recent T3010 report found on CRA???s listing for your charity.)</List.Item>
                                    </List.List>
                                </List.Item>
                                <List.Item className="number">We will send an invitation to the verified email for you to claim your charity. You will be prompted to either set up an Impact Account with administrative privileges for your Charity Account or log into an existing Impact Account.</List.Item>
                                <List.Item className="number">You can now customize your charity profile, access donor and gift information, activate direct deposit, and invite additional administrators to manage your Charity Account with you.</List.Item>
                            </List>
                        </Container>
                    </div>
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        claimCharityErrorMessage: state.user.claimCharityErrorMessage,
        isAuthenticated: state.auth.isAuthenticated,
        currentUser: state.user.info,
    };
}

const connectedComponent = (connect(mapStateToProps)(ClaimCharity));
export {
    connectedComponent as default,
    ClaimCharity,
    mapStateToProps
}
