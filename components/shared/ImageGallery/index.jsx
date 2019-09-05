import React from 'react';
import Gallery from 'react-grid-gallery';

function ImageGallery(props) {
    const {
        imagesArray,
        enableImageSelection,
    } = props;
    return (
        <Gallery
            images={imagesArray}
            enableImageSelection={enableImageSelection}
        />
        // document.getElementById('example-0')
    );
}

export default ImageGallery;
