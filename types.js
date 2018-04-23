'use strict';

const detector = require('./detector');

const baseType = (typeName, parserFunc) => {
  
  const init = (props = { emptyValue: null, warning: false });

  init.parser = (keyName, value) => {
    const result = parserFunc(value);
    if (result === null && props.warning) console.warning(`Warning: wrong value type ${typeName} for ${keyName}`);
    return result === null ? props.emptyValue : result;
  };

  init.validator = (keyName, value) => {
    const valid = parserFunc(value) !== null;
    if (!valid) throw new TypeError(`Wrong type ${typeName} for ${keyName}`);
    return true;
  }

  return init
};


const stringParser = val => {
  if (detector.isString(val) && val.length) return val;
  const parsed = val ? JSON.stringify(val) : null;
  return detector.isString(parsed) && parsed.length > 0 ? parsed : null;
}


module.exports = {
  string: baseType('STRING', stringParser)
}