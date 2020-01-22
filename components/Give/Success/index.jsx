import React, {
    useEffect,
} from 'react';
import {
    Container, Grid, Image, Header,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';


import AddMoneySuccess from '../../Give/Success/AddMoneySuccess';
import { reInitNextStep } from '../../../actions/give';
// This image is dummy image since we dont have a proper image
import successImg from '../../../static/images/dashboard_gift.png';

const Success = (props) => {
    const {
        currentUser, dispatch, donationMatchData, flowObject, successData, t: formatMessage,
    } = props;
    const {
        attributes: {
            displayName,
        },
    } = currentUser;
    const firstParagraph = formatMessage('addMoneyFirstText', { name: displayName });
    useEffect(() => {
        if (flowObject) {
            reInitNextStep(dispatch, flowObject);
        }
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }, []);
    const renderSuccessPage = () => {
        switch (flowObject.type) {
            case 'donations':
                return (
                    <AddMoneySuccess
                        donationMatchData={donationMatchData}
                        successData={successData}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <div className="flowSuccess">
            <Container>
                <Grid centered verticalAlign="middle">
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={14} computer={12}>
                            <div className="flowSuccessImg">
                                <Image src={successImg} centered />
                                <div className="mt-2 flowSuccessImgHeading">
                                    <Header as="h4" textAlign="center">
                                        {firstParagraph}
                                    </Header>
                                    {renderSuccessPage()}
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
};

Success.propTypes = {
    currentUser: PropTypes.shape({
        attributes: PropTypes.shape({
            displayName: PropTypes.string,
        }),
    }),
    dispatch: PropTypes.func,
    donationMatchData: PropTypes.arrayOf,
    i18n: PropTypes.shape({
        language: PropTypes.string,
    }),
    successData: PropTypes.shape({
        giveData: PropTypes.shape({
            donationAmount: PropTypes.string,
            donationMatch: PropTypes.shape({
                id: PropTypes.any,
                value: PropTypes.string,
            }),
            giftType: PropTypes.shape({
                value: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            }),
            giveAmount: PropTypes.string,
            giveFrom: PropTypes.shape({
                name: PropTypes.string,
                slug: PropTypes.string,
                type: PropTypes.string,
            }),
            giveTo: PropTypes.shape({
                eftEnabled: PropTypes.bool,
                name: PropTypes.string,
                slug: PropTypes.string,
                text: PropTypes.string,
                type: PropTypes.string,
                value: PropTypes.string,
            }),
            recipients: PropTypes.arrayOf(PropTypes.element),
        }),
        type: PropTypes.string,
    }),
    t: PropTypes.func,
};
Success.defaultProps = {
    currentUser: {
        attributes: {
            displayName: '',
        },
    },
    dispatch: () => { },
    donationMatchData: [],
    i18n: {
        language: 'en',
    },
    successData: {
        giveData: {
            donationAmount: '',
            donationMatch: {
                id: null,
                value: null,
            },
            giftType: {
                value: null,
            },
            giveAmount: '',
            giveFrom: {
                name: '',
                slug: '',
                value: '',
            },
            giveTo: {
                eftEnabled: false,
                name: '',
                slug: '',
                text: '',
                type: '',
                value: null,
            },
            recipients: [],
        },
        stepsCompleted: false,
        type: null,
    },
    t: () => {},
};
const mapStateToProps = (state) => ({
    currentUser: state.user.info,
    donationMatchData: state.user.donationMatchData,
    successData: state.give.successData,
});

export default withTranslation([
    'success',
])(connect(mapStateToProps)(Success));
