import React, { Fragment } from 'react';
import {
    Container,
    Header,
    Grid,
    Button,
    Image,
} from 'semantic-ui-react';
import { connect, } from 'react-redux';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import { Router } from '../../routes';
import { getUserAllDetails } from '../../actions/user';
import accessingleft from '../../static/images/claimcharity04.svg';
import accessingfull from '../../static/images/accessing1.svg';
import '../../static/less/claimcharity.less';

const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class Success extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            otherAccountsFetched: false,
        }
    }

    componentDidMount() {
        const {
            currentUser: {
                id: userId,
            },
            dispatch,
            slug,
        } = this.props;
        getUserAllDetails(dispatch, userId).then((otherAccounts) => {
            const slugValue = otherAccounts.find((item) => item.slug === slug);
            if (!_isEmpty(slugValue)) {
                Router.pushRoute('/dashboard');
            }
            this.setState({
                ...this.state,
                otherAccountsFetched: true,
                otherAccounts,
            });
        });
    }

    renderGoToCharityBtn = (locationNumber, buttonPosition) => {
        const {
            otherAccountsFetched
        } = this.state;
        return (
            <a href={`${RAILS_APP_URL_ORIGIN}${locationNumber}`}>
                <Button
                    className={buttonPosition ? "primary blue-btn-rounded btnfont mt-1" : "white-btn-round paddingBtn"}
                    disabled={!otherAccountsFetched}
                >
                    Go to Charity Account
                </Button>
            </a>
        )
    }

    render() {
        const {
            currentUser: {
                attributes: {
                    displayName,
                    firstName,
                }
            },
            slug,
        } = this.props;
        const {
            otherAccounts,
        } = this.state;
        let charityName, locationNumber;
        if (otherAccounts && slug) {
            let charityItems = otherAccounts.find((item) => item.slug === slug);
            if (!_isEmpty(charityItems)) {
                charityName = charityItems.name;
                locationNumber = charityItems.location;
            }
        };
        return (
            <Fragment>
                <div className="AccessingtopBanner">
                    <Container>
                        <div className="lefttopicon"></div>
                        <div className="bannerHeading">
                            <Header as='h3'>
                                {!_isEmpty(displayName) ? displayName : firstName}
                            , you’ve claimed your charity </Header>
                            <p data-test="ClaimCharity_Success_charityname_text">Now you have access to your charity {charityName ? charityName : ''}’s account.</p>
                            {this.renderGoToCharityBtn(locationNumber, 1)}
                        </div>
                    </Container>
                </div>
                <div className="Accessing">
                    <Container>
                        <div className="Accessingheading">
                            <Header as='h3'>Accessing your Charity Account</Header>
                        </div>
                        <div className="Accessingfullwidth">
                            <Grid>
                                <Grid.Row verticalAlign='middle'>
                                    <Grid.Column mobile={16} tablet={16} computer={7}>
                                        <div className="accessingleft">
                                            <Header as='h3'>One login for both accounts</Header>
                                            <p>Your personal Impact Account and Charity Account are linked together. You can use the same email and password to access both accounts.</p>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={16} computer={9}>
                                        <div className="accessingrigghtImg">
                                            <Image src={accessingleft} />
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Container>
                    <div className="accountseasily">
                        <Container>
                            <div className="accountseasilyheading">
                                <Header as='h3'>Switch between accounts easily</Header>
                                <p>When you’re logged in, select your profile photo. Then choose “Switch account” to go between your personal Impact Account and Charity Account.</p>
                            </div>
                        </Container>
                        <div className="accountfullimg">
                            <Image src={accessingfull} />
                        </div>
                    </div>
                </div>
                <div className="startCustomizing">
                    <Container>
                        <div className="startCustomizingheading">
                            <p>Start customizing your Charity Account</p>
                            {this.renderGoToCharityBtn(locationNumber)}
                        </div>
                    </Container>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    // otherAccounts: state.user.otherAccounts,
    currentUser: state.user.info,
});

const connectedComponent = (connect(mapStateToProps)(Success));
export{
    connectedComponent as default,
    Success,
    mapStateToProps
};
