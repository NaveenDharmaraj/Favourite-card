import {
    Container,
    Grid,
    Image,
    Header,
    Button,
    Dropdown,
} from 'semantic-ui-react';

import { Router } from '../../routes';
import Layout from '../shared/Layout';
import '../../static/less/charityProfile.less';
import '../../static/less/create_manage_group.less';
import groupImg from '../../static/images/no-data-avatar-giving-group-profile.png';
import ManageGivingGroupAccordian from './ManageGivingGroupAccordian';

const ManageGivingGroup = ({ groupDetails, step, substep }) => {
    const handleReturnToProfile = (slug) => {
        Router.pushRoute(`/groups/${slug}`)
        return;
    }

    const {
        attributes: {
            avatar,
            causes,
            location,
            name,
            slug
        },
    } = groupDetails;
    const groupDisplayImage = avatar || groupImg;
    return (
        <Layout authRequired>
            <Container>
                <div className='manage_giving_group_wrap'>
                    <div className="ch_headerImage greenBg greenBgnew" />
                    <Grid.Row>
                        <Grid>
                            <Grid.Column mobile={16} tablet={10} computer={11}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={4} computer={4} className="ch_profileWrap">
                                            <div className='GG_profileWrap'>
                                                <div className="ch_profileImage">
                                                    <Image src={groupDisplayImage} />
                                                </div>
                                                <Dropdown className='' icon='camera' direction='right'>
                                                    <Dropdown.Menu >
                                                        <Dropdown.Item text='Delete photo' />
                                                        <Dropdown.Item text='Change photo' />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {/* <Icon name='camera'/> */}
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={12} computer={12}>
                                            <div className="ch_profileDetails">
                                                <Header as="h5" className='textGreen'>
                                                    Giving group
                                                </Header>
                                                <Header as="h3">
                                                    {name}
                                                    <br />
                                                </Header>
                                                <Header as="p">
                                                    {location}
                                                </Header>
                                                <div className="ch_badge-group">
                                                    {
                                                        causes && causes.map((cause) => (
                                                            <span className="badge">
                                                                {cause.display_name}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={5} className='returnBtnWrap'>
                                <Button
                                    className='blue-bordr-btn-round-def'
                                    onClick={() => handleReturnToProfile(slug)}
                                >
                                    Return to profile
                                    </Button>
                            </Grid.Column>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row>
                        <ManageGivingGroupAccordian
                            step={step}
                            substep={substep}
                            slug={slug}
                        />
                    </Grid.Row>
                </div>
            </Container>
        </Layout>
    )
};
ManageGivingGroup.defaultProps = {
    dispatch: () => { },
    groupDetails: {
        attributes: {
            avatar: '',
            causes: [],
            location: '',
            name: '',
            slug: ''
        },
    },
    step: '',
    substep: '',
    t: () => { },
};
export default ManageGivingGroup;
