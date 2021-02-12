import React, { Fragment } from 'react';
import {
    Header,
    Form,
    Checkbox,
    Button,
    Icon,
    Image,Card,Grid
} from 'semantic-ui-react';

import { Link } from '../../../routes';
import noDataImg from '../../../static/images/dashboard_nodata_illustration.png';
function inviteFriends() {

    
    return (
 
        <div className='basicsettings'>
             <Header className='titleHeader'>Manage
            </Header>
                    <div className='GetDonation'>
                        <div className="Step1">
                            <p className="stepSubHeader">This Giving Group doesn't have any members yet.</p>
                            <div className="ManageNoData">
                                <div className="ManageNoDataLeftImg">
                                    <Image className="Connect_img" src={noDataImg} />
                                </div>
                                <div className="ManageNoDataRightText">
                                <Header as='h4'>Invite friends to join your group</Header>
                                <Button className="success-btn-rounded-def">Find friends</Button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='GetDonation mt-2'>
                        <div className="Step1">
                            <div className="ManageNoData">
                                <div className="ManageNoDataLeftImg">
                                    <Image className="Connect_img" src={noDataImg} />
                                </div>
                                <div className="ManageNoDataRightText">
                                <Header as='h4'>Connect with people you know on Charitable Impact.</Header>
                                <Button className="success-btn-rounded-def">Find friends</Button>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>    
    
    );
}

export default inviteFriends;
