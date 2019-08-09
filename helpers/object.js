import _isUndefined from 'lodash/isUndefined';
import _isEmpty from 'lodash/isEmpty';

 /**
 * Checks if an object is undefined or empty.
 * @param  {Object} obj the to be checked for undefind or null
 * @return {Boolean} true when the object is undefined or empty.
 */
const isUndefinedOrEmpty = (obj) => _isUndefined(obj) || _isEmpty(obj);

 export default isUndefinedOrEmpty;