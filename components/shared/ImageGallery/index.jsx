
import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import Gallery from 'react-grid-gallery';

function ImageGallery(props) {
    const {
        enableImageSelection,
        imagesArray,
        imagesArray: {
            src,
        },
    } = props;
    if (imagesArray.length > 1) {
        return (
            <Gallery
                images={imagesArray}
                enableImageSelection={enableImageSelection}
                margin={8}
            />
        );
    }
    return (
        <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={16} className="OneGrProfileImg">
                <Image src={src} />
            </Grid.Column>
        </Grid.Row>
    );
}

export default ImageGallery;
