import React, { Fragment } from 'react';
import {
    Container,
    Header,
    Grid,
    Image,
    Divider,
    Responsive,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../routes';
import Layout from '../components/shared/Layout';
import '../static/less/claimP2P.less';
import ClaimP2PSignUp from '../components/ClaimP2PSignUp';
import coreApi from '../services/coreApi';
import { withTranslation } from '../i18n';

class ClaimP2P extends React.Component {
    static async getInitialProps({ query }) {
        let userInfo = {};
        try {
            userInfo = await coreApi.get(`/claimP2ps/${query.claimToken}`);
        } catch (err) {
            userInfo = {};
        }
        return {
            claimToken: query.claimToken,
            namespacesRequired: [
                'claimP2P',
            ],
            userInfo,
        };
    }

    componentDidMount() {
        const {
            userInfo,
        } = this.props;
        if (_isEmpty(userInfo)) {
            Router.push('/users/login');
        }
    }

    render() {
        const {
            claimToken,
            userInfo: {
                avatar,
                senderDisplayName,
                giftAmount,
                giftMessage,
                invitedUserEmail,
            },
            userInfo,
        } = this.props;
        const formatMessage = this.props.t;
        return (
            <Fragment>
                {!_isEmpty(userInfo) && (
                    <Layout>
                        <div className="claimP2PScreen">
                            <div className="claimp2pHeader">

                                <Container>
                                    <Grid centered padded>
                                        <Grid.Column computer={6} tablet={6} mobile={16} textAlign="center">
                                            <div className="claimp2pUserImage">
                                                {avatar && <Image src={avatar} data-test="claimp2p_header_image" />}
                                            </div>
                                            <Header as="h2" data-test="claimp2p_header_description">
                                                {formatMessage('description', {
                                                    giftAmount,
                                                    senderDisplayName,
                                                })}

                                            </Header>
                                        </Grid.Column>
                                    </Grid>
                                    <p data-test="claimp2p_header_thanknote">
                                        {giftMessage}
                                    </p>
                                </Container>
                            </div>
                            <div className="claimp2pImpActBg">
                                <Container>
                                    <Grid padded>
                                        <Grid.Row className="pad-0">
                                            <Grid.Column computer={16} tablet={16} mobile={16} className="claimp2pImpAct">
                                                <div className="claimp2pImpActWrap">
                                                    <Header as="h2" textAlign="center">{formatMessage('impAccountHeader')}</Header>
                                                    <p className="subTtle_1">{formatMessage('impAccountPara1')}</p>
                                                    <p className="subTtle_2">{formatMessage('impAccountPara2')}</p>
                                                    <ClaimP2PSignUp
                                                        email={invitedUserEmail}
                                                        claimToken={claimToken}
                                                    />
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Container>
                            </div>
                            <Container>
                                <Grid padded>
                                    <Grid.Row className="pad-0">
                                        <Grid.Column computer={16} tablet={16} mobile={16} className="claimp2pHwItWrks">
                                            <Header data-test="claimp2p_howItWorks_header" as="h2" textAlign="center">{formatMessage('howItWorks.header')}</Header>
                                            <Grid columns="equal" stackable>

                                                <Grid.Column>
                                                    <div>
                                                        <Image data-test="claimp2p_howItWorks_findCharityImage" src="/static/images/Bitmap.png" />
                                                    </div>
                                                    <Header data-test="claimp2p_findCharity_header" as="h2">{formatMessage('howItWorks.findCharity')}</Header>
                                                    <p data-test="claimp2p_howItWorks_findCharity_desc">{formatMessage('howItWorks.findCharityDesc')}</p>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <div>
                                                        <Image data-test="claimp2p_howItWorks_addMoney_image" src="/static/images/dollerGroup.png" />
                                                    </div>
                                                    <Header data-test="claimp2p_addMoney_header" as="h2">{formatMessage('howItWorks.addMoney')}</Header>
                                                    <p data-test="claimp2p_howItWorks_addMoney_desc">{formatMessage('howItWorks.addMoneyDesc')}</p>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <div>
                                                        <Image data-test="claimp2p_howItWorks_give_image" src="/static/images/handFlower.png" />
                                                    </div>
                                                    <Header as="h2">{formatMessage('howItWorks.give')}</Header>
                                                    <p data-test="claimp2p_howItWorks_give_desc">{formatMessage('howItWorks.giveDesc')}</p>
                                                </Grid.Column>

                                            </Grid>
                                            <Divider />
                                        </Grid.Column>
                                        <Grid.Column computer={16} tablet={16} mobile={16} textAlign="center" className="claimp2pWhoWer">
                                            <Header data-test="claimp2p_howItWorks_whoWeAre" as="h2">
                                                {formatMessage('whoWeAre.whoWeAreHeader')}
                                            </Header>
                                            <span className="underline" />
                                            <p data-test="claimp2p_whoWeAre_desc1">{formatMessage('whoWeAre.whoWeAreDesc1')}</p>
                                            <p data-test="claimp2p_whoWeAre_desc2">{formatMessage('whoWeAre.whoWeAreDesc2')}</p>
                                            <Responsive maxWidth={767}>
                                                <Divider />
                                            </Responsive>
                                        </Grid.Column>
                                        <Grid.Column computer={16} tablet={16} mobile={16} className="claimp2pJoin">
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column computer={16} tablet={16} mobile={16} textAlign="center">
                                                        <Header data-test="claimp2p_header_joinCharity" as="h2">{formatMessage('join.joinHeader')}</Header>
                                                        <span className="underline" />
                                                        <Grid columns="equal" stackable className="cliamp2pThreeColumn">

                                                            <Grid.Column>
                                                                <Header as="h2">{formatMessage('join.joindesc1Header')}</Header>
                                                                <p data-test="claimp2p_joinSection_desc1">{formatMessage('join.joindesc1Desc')}</p>
                                                            </Grid.Column>
                                                            <Grid.Column>
                                                                <Header as="h2">{formatMessage('join.joindesc2Header')}</Header>
                                                                <p data-test="claimp2p_joinSection_desc2">{formatMessage('join.joindesc2Desc')}</p>
                                                            </Grid.Column>
                                                            <Grid.Column>
                                                                <Header as="h2">{formatMessage('join.joindesc3Header')}</Header>
                                                                <p data-test="claimp2p_joinSection_desc3">{formatMessage('join.joindesc3Desc')}</p>
                                                            </Grid.Column>
                                                        </Grid>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </div>
                    </Layout>
                )
                }
            </Fragment>
        );
    }
}

ClaimP2P.defaultProps = {
    claimToken: '',
    userInfo: {
        avatar: '',
        giftAmount: '',
        giftMessage: '',
        invitedUserEmail: '',
        senderDisplayName: '',
    },
};

ClaimP2P.propTypes = {
    claimToken: PropTypes.string,
    userInfo: PropTypes.shape({
        avatar: PropTypes.string,
        giftAmount: PropTypes.string,
        giftMessage: PropTypes.string,
        invitedUserEmail: PropTypes.string,
        senderDisplayName: PropTypes.string,
    }),
};

const withTranslationClaimP2P = withTranslation('claimP2P')(ClaimP2P);

export {
    withTranslationClaimP2P as default,
    ClaimP2P,

};
