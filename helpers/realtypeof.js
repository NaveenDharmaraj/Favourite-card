import _ from 'lodash';
// import isMap from './isMap';
// import isThenable from './isThenable';

/**
 * Helper to determine what a given inpurt _actually_ is.
 * @param  {*} input      What to check
 * @return {String}       A string of the actual type, or 'unknown' if unrecognised.
 */
const realtypeof = (input) => {
    if (_.isArray(input) || _.isTypedArray(input)) return 'array';
    if (_.isBoolean(input)) return 'boolean';
    if (_.isBuffer(input)) return 'buffer';
    if (_.isDate(input)) return 'date';
    if (_.isElement(input)) return 'element';
    if (_.isError(input)) return 'error';
    if (_.isFunction(input)) return 'function';
    // if (isMap(input)) return 'map';
    if (_.isNull(input)) return 'null';
    if (_.isFinite(input)) return 'number';
    if (_.isPlainObject(input)) return 'object';
    // if (isThenable(input)) return 'promise';
    if (_.isRegExp(input)) return 'regex';
    if (input instanceof Set || _.isSet(input)) return 'set';
    if (_.isString(input)) return 'string';
    if (_.isSymbol(input)) return 'symbol';
    if (_.isUndefined(input)) return 'undefined';
    if (input instanceof WeakMap || _.isWeakMap(input)) return 'weakmap';
    if (input instanceof WeakSet || _.isWeakSet(input)) return 'weakset';

    return 'unknown';
};

export default realtypeof;
