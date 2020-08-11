import React, {
    Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
    string,
} from 'prop-types';
import {
    Grid,
    Header,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';

const AboutGroup = (props) => {
    const {
        groupDetails: {
            attributes: {
                formattedShort,
                videoPlayerLink,
                formattedImpact,
                formattedHelping,
                formattedAbout,
            },
        },
    } = props;
    return (
        <Fragment>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} className="ch_paragraph">
                    {formattedShort
                    && (
                        <div className="GroupPurposeTop">
                            <p>
                                {ReactHtmlParser(formattedShort)}
                            </p>
                        </div>
                    )}
                    {videoPlayerLink
                        && (
                            <div className="mb-3 videoWrapper text-center">
                                <embed
                                    title="video"
                                    src={videoPlayerLink}
                                    className="responsiveVideo"
                                />
                            </div>
                        )}
                    {formattedImpact
                    && (
                        <div className="GroupPurpose">
                            <Header as="h3">The Group’s Purpose</Header>
                            <p>
                                {ReactHtmlParser(formattedImpact)}
                            </p>
                        </div>
                    )}
                    {formattedHelping
                    && (
                        <div className="GroupPurpose">
                            <Header as="h3">How to Help</Header>
                            <p>
                                { ReactHtmlParser(formattedHelping) }
                            </p>
                        </div>
                    )}
                    {formattedAbout
                    && (
                        <div className="GroupPurpose">
                            <Header as="h3">About the Organizers</Header>
                            <p>
                                { ReactHtmlParser(formattedAbout) }
                            </p>
                        </div>
                    )}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} className="OneGrProfileImg">
                    <p>IMAGE GALLERY</p>
                </Grid.Column>
            </Grid.Row>
        </Fragment>
    );
};

AboutGroup.defaultProps = {
    groupDetails: {
        attributes: {
            formattedAbout: '',
            formattedHelping: '',
            formattedImpact: '',
            formattedShort: '',
            videoPlayerLink: '',
        },
    },
};

AboutGroup.propTypes = {
    groupDetails: {
        attributes: {
            formattedAbout: string,
            formattedHelping: string,
            formattedImpact: string,
            formattedShort: string,
            videoPlayerLink: string,
        },
    },
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
    };
}

export default connect(mapStateToProps)(AboutGroup);
