
import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import Gallery from 'react-grid-gallery';

function ImageGallery(props) {
    const {
        enableImageSelection,
        imagesArray,
        rowHeight,
        renderSingleImage
    } = props;
    if (imagesArray.length === 1 && renderSingleImage) {
        return (
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} className="OneGrProfileImg">
                    <Image src={imagesArray[0].src} />
                </Grid.Column>
            </Grid.Row>
        );
    }
    return (
        <Gallery
            images={imagesArray}
            enableImageSelection={enableImageSelection}
            margin={8}
            rowHeight={rowHeight}
        />
    );
}

ImageGallery.defaultProps = {
    rowHeight: null,
    renderSingleImage: true,
};
export default ImageGallery;
