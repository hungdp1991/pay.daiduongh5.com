const Validate = {};

Validate.isRequired = (value) => {
    if (value.trim().length === 0) {
        return true;
    }
    return false;
}

/**
 * Check minlength
 */
Validate.minLength = (value, min) => {
    return value.length < min;
}
  
  /**
   * Check maxlength
   */
Validate.maxLength = (value, max) => {
    return value.length > max;
}





export default Validate;