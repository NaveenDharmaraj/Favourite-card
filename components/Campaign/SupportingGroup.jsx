
import React from 'react'
import { Image, Header } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import { renderTextByCharacter } from '../../helpers/utils';
import { withTranslation } from '../../i18n';

function SupportingGroup(props) {
    const {
        entityName,
        city,
        province,
        placeholder,
        amountRaised,
        type,
        causes,
        t: formatMessage,
    } = props;
    const entityShortName = renderTextByCharacter(entityName, 25);
    let locationDetails = '';
    if (_isEmpty(city) && !_isEmpty(province)) {
        locationDetails = province;
    } else if (!_isEmpty(city) && _isEmpty(province)) {
        locationDetails = city;
    } else if (!_isEmpty(city) && !_isEmpty(province)) {
        locationDetails = `${city}, ${province}`;
    }
    let causesNames = '';
    const causesNameList = _.map(causes, 'display_name');
    causesNames = causesNameList.join(',');
    return (
        <div className="col-sm-6">
            <div className="campaignCard">
                <div className="CardProfile">
                    <Image src={placeholder} />
                </div>
                <div className="CardgiveGroupDetails">
                    <Header as="h4">{type}</Header>
                    <Header as="h2">
                        {entityShortName}
                    </Header>
                    <p>{causesNames}</p>
                    <p>{locationDetails}</p>
                    <p>
                        {formatMessage('campaignProfile:totalAmountRaised', {
                            amount: amountRaised,
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default withTranslation('claimProfile')(SupportingGroup);
