import React from 'react';
import {
    Card,
    Image,
    Header,
    Button,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import noDataImg from '../../static/images/noresults.png';

const { publicRuntimeConfig } = getConfig();
const {
    RAILS_APP_URL_ORIGIN,
} = publicRuntimeConfig;

const GroupNoDataState = (props) => {
    const {
        type,
        isAdmin,
        slug,
    } = props;
    let contentData = '';
    let subHeaderData = '';
    let manageButton = false;
    if (type === 'charities' && !isAdmin) {
        contentData = 'Please check back later';
        subHeaderData = 'This Giving Group has not yet chosen the charities it supports.';
    }
    switch (type) {
        case 'charities':
            if (isAdmin) {
                contentData = 'No charities selected yet';
                manageButton = true;
                subHeaderData = 'Choose charities that this Giving Group will support.';
            } else {
                contentData = 'Please check back later';
                subHeaderData = 'This Giving Group has not yet chosen the charities it supports.';
            }
            break;
        case 'transactions':
            contentData = 'No transactions yet';
            subHeaderData = 'Gifts sent to and from this Giving Group will appear here.';
            break;
        case 'common':
            contentData = 'Please check back later';
            subHeaderData = 'It looks like we haven\'t yet received this information from the Canada Revenue Agency.';
            break;
        default:
            break;
    }
    return (
        <Card fluid className="noDataCard rightImg">
            <Card.Content>
                <Image
                    floated="right"
                    src={noDataImg}
                />
                <Card.Header className="font-s-14">
                    <Header as="h4">
                        <Header.Content>
                            {contentData}
                            <Header.Subheader>
                                {subHeaderData}
                            </Header.Subheader>
                            {manageButton
                                && (
                                    <a href={(`${RAILS_APP_URL_ORIGIN}/groups/${slug}/edit`)}>
                                        <Button
                                            className="success-btn-rounded-def mt-1"
                                            content="Manage Giving Group"
                                        />
                                    </a>
                                )}
                        </Header.Content>
                    </Header>
                </Card.Header>
            </Card.Content>
        </Card>
    );
};

export default GroupNoDataState;
