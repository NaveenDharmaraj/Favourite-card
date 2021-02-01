import React from 'react';
import Gallery from 'react-grid-gallery';

function ImageGallery(props) {
    const {
        imagesArray,
        enableImageSelection,
        rowHeight,
    } = props;
    return (
        <Gallery
            images={imagesArray}
            enableImageSelection={enableImageSelection}
            margin={8}
            rowHeight={rowHeight}
        />
        // document.getElementById('example-0')
    );
}

export default ImageGallery;
