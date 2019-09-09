/* eslint-disable class-methods-use-this */
import _remove from 'lodash/remove'; 
import TagManager from 'react-gtm-module';

// Add an additional set of data to be sent with every call to GTM.

const addToDataLayer = (tagManagerArgs) => {
    TagManager.dataLayer(tagManagerArgs);
};

/**
     * Remove an existing set of data from the list sent to GTM every call.
     * @param {*} predicate - Can be any accepted predicate, including shortcuts like a property
     * name.
     * @return {array} - A list containing the removed item(s). If the return is an empty array, the
     * supplied needle was not found (and the removal failed).
     * @see https://lodash.com/docs#remove
     * @example
     * ```js
     * gTM.removeFromDataLayer('userId');
     * // ⚠️ matches any object that contains a property named 'userId'
     * ```
     * ```js
     * gTM.removeFromDataLayer({ foo: 'a' });
     * // strictly equal (will not match obj with additional properties)
     * ```
     */
const removeFromDataLayer = (predicate) => {
    debugger
    if (typeof window !== 'undefined' && window.dataLayer && window.dataLayer.length) {
        this.dataLayer = window.dataLayer;
    }
    const dataPush = _remove(this.dataLayer, predicate);
    TagManager.dataLayer(dataPush);
};


export {
    addToDataLayer,
    removeFromDataLayer,
};
