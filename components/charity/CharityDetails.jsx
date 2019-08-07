import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Container,
    Image,
    Button,
    Header,
} from 'semantic-ui-react';

import getConfig from 'next/config';
import { Link } from '../../routes';
const { publicRuntimeConfig } = getConfig();

const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

class CharityDetails extends React.Component {
    constructor(props) {
        super(props);
        console.log('CharityDetails props', props);
    }

    static getCauses(causesList){
        return (
        causesList.map((cause)=> (
                <span className="badge">{cause.display_name}</span>
        ))
        );
    }

    render() {
        const {
            charityDetails,
            isAUthenticated,
        } = this.props;
        let buttonLink = null;
        if (charityDetails && charityDetails.charityDetails.attributes) {
            if (isAUthenticated) {
                buttonLink = (
                    <Link route={(`/give/to/charity/${charityDetails.charityDetails.attributes.slug}/gift/new`)}>
                        <Button primary fluid className="blue-btn-rounded">Give</Button>
                    </Link>
                );
            } else {
                buttonLink = (
                    <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/charity/${charityDetails.charityDetails.attributes.slug}/gift/new`)}>
                        <Button primary fluid className="blue-btn-rounded">Give</Button>
                    </a>
                );
            }
        }
        return (
            <div className="profile-header">
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={3} computer={2}>
                                    <div className="profile-img-rounded">
                                    <Image circular src={(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.avatar} />
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={10} computer={11}>
                                    <div className="ProfileHeaderWraper">
                                        <Header as='h3'>
                                        {(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.name}
                                            <Header.Subheader>{(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.location}</Header.Subheader>
                                        </Header>
                                        <div className="badge-group">
                                        {(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes)
                                            && CharityDetails.getCauses(charityDetails.charityDetails.attributes.causes)}
                                        </div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={3} computer={3}>
                                    <div className="buttonWraper">
                                    {buttonLink}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
            
            // <Grid.Column>
            //     <Grid>
            //         <Grid.Row stretched>
            //             <Grid.Column mobile={16} tablet={5} computer={5}>
            //                 <Card className="charityLogo-wraper">
            //                     <div className="verticalCenter">
            //                         <Image src={(charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.avatar} />
            //                     </div>
            //                 </Card>
            //             </Grid.Column>
            //             <Grid.Column mobile={16} tablet={11} computer={11}>
            //                 <div className="CharityDescription">
            //                     <h6 className="text-muted">{(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.beneficiaryType}</h6>
            //                     <h3>{(charityDetails && charityDetails.charityDetails && charityDetails.charityDetails.attributes) && charityDetails.charityDetails.attributes.name}</h3>
            //                     <div>
            //                         {buttonLink}
            //                         <Button
            //                             color="blue"
            //                             content="Contact this charity"
            //                             // id="taxReceiptsLink"
            //                             // path={taxProfileLink}
            //                         />
            //                     </div>
            //                 </div>
            //             </Grid.Column>
            //         </Grid.Row>
            //     </Grid>
            //     <p className="mt-2">
            //         Is this your chariy? You can claim your free profile page on your platform
            //         <a href="#">by following these steps</a>
            //     </p>
            // </Grid.Column>
        );
    };
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
        isAUthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(CharityDetails);
