import React from 'react';
import {
    Button,
    Container,
    Header,
    Grid,
} from 'semantic-ui-react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const {
    HELP_CENTRE_URL,
} = publicRuntimeConfig;

// eslint-disable-next-line react/prefer-stateless-function
class HelpCenter extends React.Component {
    lazyLoadImage = () => {
        const options = {
            root: null,
            threshold: 0,
            rootMargin: '0px 0px 150px 0px',
        };
        const _imageElement = document.querySelectorAll('.helpCenter');
        if ('IntersectionObserver' in window) {
            // LazyLoad images using IntersectionObserver
            const Observer = new IntersectionObserver(((entries, Observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return
                    } else {
                        entry.target.classList.add("helpImg");
                        Observer.unobserve(entry.target);
                    }
                });
            }), options);
            _imageElement.forEach((element) => {
                Observer.observe(element);
            });
        } else {
            // Load all images at once
            _imageElement.forEach((element) => {
                element.classList.add("helpImg")
            });
        }

    };
    componentDidMount() {
        this.lazyLoadImage();
    }
    render() {
        return (
            <div className="footer-help">
                <Container>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={12} tablet={6} computer={6} className="helpCenter">
                                <div />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Header as="h2" className="f-normal">
                                    <span className="bold">Find answers to common questions.</span>
                                    <Header.Subheader>Visit the Help Centre. </Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={4} computer={4} className="text-md-right">
                                <Button
                                    className="white-btn-round"
                                >
                                    <a href={HELP_CENTRE_URL} target="_blank">
                                        Help Centre
                                    </a>
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default HelpCenter;
