import {
    PropTypes,
} from 'prop-types';
import { Button, Grid, Header, Image } from 'semantic-ui-react';
import {
    Link,
} from '../../../routes';

const NoDataState = ({
    className,
    image,
    content,
    route,
    ror,
    btnClass,
    btnTitle
}) => {
    return (
        <div className={className}>
            <Grid verticalAlign="middle">
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={6} computer={6}>
                        <Image src={image} className="noDataLeftImg" />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={10} computer={10}>
                        <div className="givingGroupNoDataContent">
                            <Header as="h4">
                                <Header.Content>
                                    {content}
                                </Header.Content>
                            </Header>
                            <div>
                                {ror ?
                                    <a href={route}>
                                        <Button className={btnClass}>{btnTitle}</Button>
                                    </a>
                                    :
                                    <Link route={route} passHref>
                                        <Button className={btnClass}>{btnTitle}</Button>
                                    </Link>
                                }
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
}

NoDataState.defaultProps = {
    className: '',
    image: '',
    content: '',
    route: '',
    ror: false,
    btnClass: '',
    btnTitle: ''
};

NoDataState.PropTypes = {
    className: PropTypes.string,
    image: PropTypes.string,
    content: PropTypes.string,
    route: PropTypes.string,
    ror: PropTypes.bool,
    btnClass: PropTypes.string,
    btnTitle: PropTypes.string
};

export default NoDataState;