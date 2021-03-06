
import React from 'react'
import { Image, Header } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import {
    PropTypes,
} from 'prop-types';

import { Link } from '../../routes';
import { formatCurrency } from '../../helpers/give/utils';
import { renderTextByCharacter } from '../../helpers/utils';
import { withTranslation } from '../../i18n';

function SupportingGroup(props) {
    const {
        entityName,
        city,
        province,
        placeholder,
        amountRaised,
        i18n: {
            language,
        },
        type,
        causes,
        subgroupSlug,
        t: formatMessage,
    } = props;
    const currency = 'USD';
    const entityShortName = renderTextByCharacter(entityName, 37);
    let locationDetails = '';
    if (_isEmpty(city) && !_isEmpty(province)) {
        locationDetails = province;
    } else if (!_isEmpty(city) && _isEmpty(province)) {
        locationDetails = city;
    } else if (!_isEmpty(city) && !_isEmpty(province)) {
        locationDetails = `${city}, ${province}`;
    }
    let causesNames = '';
    const causesNameList = _map(causes, 'display_name');
    causesNames = causesNameList.join(',');
    return (
        <Link route={(`/groups/${subgroupSlug}`)}>
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
                                amount: formatCurrency(amountRaised, language, currency),
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

SupportingGroup.defaultProps = {
    entityName: '',
    city: '',
    province: '',
    placeholder: '',
    amountRaised: '',
    i18n: {
        language: '',
    },
    type: '',
    causes: [],
    subgroupSlug: '',
    t: () => {},
}

// eslint-disable-next-line react/no-typos
SupportingGroup.PropTypes = {
    entityName: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    placeholder: PropTypes.string,
    amountRaised: PropTypes.string,
    i18n: PropTypes.shape({
        language: PropTypes.string,
    }),
    type: PropTypes.string,
    causes: PropTypes.array,
    subgroupSlug: PropTypes.string,
    t: PropTypes.func,
}

export default withTranslation('claimProfile')(SupportingGroup);
