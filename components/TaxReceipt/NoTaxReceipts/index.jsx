import React, { cloneElement } from 'react';
import Layout from '../../shared/Layout';
import {
  List,
  Image,
} from 'semantic-ui-react'
import docIcon from '../../../static/images/icons/icon-document.svg?next-images-ignore=true';
class NoTaxReceipts extends React.Component {
    render() {
        return (
            <div className="noDataReceipts">
                <List verticalAlign='middle' className="receiptList">
                    <List.Item>
                        <Image className="greyIcon mr-1" src={docIcon} />
                        <List.Content>
                            <List.Header className="font-s-18 mb-1-2">No tax receipts yet</List.Header>
                            When you add money to your Impact Account, it’s considered a donation. Tax receipts for donations will appear here.
                        </List.Content>
                    </List.Item>
                </List>
            </div>
        );
    }
    
}
    
export default NoTaxReceipts;
