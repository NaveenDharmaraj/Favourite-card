
import React from 'react'
import { Image, Header } from 'semantic-ui-react';

import { withTranslation } from '../../i18n';

function SupportingGroup(props) {
    const {
        entityName,
        location,
        placeholder,
        amountRaised,
        type,
        cause,
        t: formatMessage,
    } = props;
    const entityShortName = renderTextByCharacter(entityName, 25);
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
                        <span className="textnormal">
                            {formatMessage('campaignProfile:decisionTree')}
                        </span>
                    </Header>
                    <p>{cause}</p>
                    <p>{location}</p>
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
