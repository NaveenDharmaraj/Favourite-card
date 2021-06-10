import React, {
    useRef,
} from 'react';
import {
    Container,
    Grid,
    Image,
    Header,
    Button,
    Dropdown,
} from 'semantic-ui-react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import { Link } from '../../routes';
import Layout from '../shared/Layout';
import '../../static/less/charityProfile.less';
import '../../static/less/create_manage_group.less';
import groupImg from '../../static/images/no-data-avatar-giving-group-profile.png';
import { intializeCreateGivingGroup } from '../../helpers/createGrouputils';
import { getBase64 } from '../../helpers/chat/utils';
import {
    deleteGroupLogo,
    editGivingGroupApiCall,
} from '../../actions/createGivingGroup';

import ManageGivingGroupAccordian from './ManageGivingGroupAccordian';

const ManageGivingGroup = ({
    step,
    substep,
}) => {
    const editGivingGroupStoreFlowObject = useSelector((state) => (
        state.createGivingGroup.editGivingGroupStoreFlowObject || intializeCreateGivingGroup
    ));
    const {
        attributes: {
            avatar,
            causes,
            location,
            name,
            slug,
        },
        id: groupId,
    } = editGivingGroupStoreFlowObject;
    const uploadLogoImageRef = useRef(null);
    const groupDisplayImage = avatar || groupImg;
    const dispatch = useDispatch();

    const handleUpload = (event, mode = '') => {
        try {
            if (mode === 'remove') {
                dispatch(deleteGroupLogo(editGivingGroupStoreFlowObject, groupId));
                return;
            }
            getBase64(event.target.files[0], (result) => {
                const editObject = {
                    attributes: {
                        logo: result,
                    },
                };
                dispatch(editGivingGroupApiCall(editObject, groupId));
            });
        }
        catch (err) {
            //handle error
        }
    };
    return (
        <Layout authRequired>
            <Container>
                <div className="manage_giving_group_wrap">
                    <div className="ch_headerImage greenBg greenBgnew" />
                    <Grid.Row>
                        <Grid>
                            <Grid.Column mobile={16} tablet={10} computer={11}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={4} computer={4} className="ch_profileWrap">
                                            <div className="GG_profileWrap">
                                                <div className="ch_profileImage">
                                                    <Image src={groupDisplayImage} />
                                                </div>
                                                <input
                                                    id="myInput"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    type="file"
                                                    ref={uploadLogoImageRef}
                                                    style={{ display: 'none' }}
                                                    onChange={(event) => handleUpload(event, 'add')}
                                                />
                                                <Dropdown icon="camera" direction="right">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={(event) => handleUpload(event, 'remove')}
                                                            text="Delete photo"
                                                        />
                                                        <Dropdown.Item
                                                            text="Change photo"
                                                            onClick={() => uploadLogoImageRef.current.click()}
                                                        />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={12} computer={12}>
                                            <div className="ch_profileDetails">
                                                <Header as="h5" className="textGreen">
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
                            <Grid.Column mobile={16} tablet={6} computer={5} className="returnBtnWrap">
                                <Link route={`/groups/${slug}`}>
                                    <Button
                                        className="blue-bordr-btn-round-def"
                                    >
                                    Return to profile
                                    </Button>
                                </Link>
                            </Grid.Column>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row>
                        <ManageGivingGroupAccordian
                            step={step}
                            substep={substep}
                            slug={slug}
                            groupId={groupId}
                            editGivingGroupStoreFlowObject={editGivingGroupStoreFlowObject}
                        />
                    </Grid.Row>
                </div>
            </Container>
        </Layout>
    );
};

ManageGivingGroup.defaultProps = {
    dispatch: () => { },
    step: '',
    substep: '',
    t: () => { },
};
export default ManageGivingGroup;
