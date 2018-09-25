'use strict';

const { isNil } = require('lodash');
const { combineDefaultOptions } = require('./utils');
const {
  isFloat,
  isString,
  isStringFloat,
  isFunction,
  isNumber
} = require('./detector');

const parseValue = value => {
  if (isFloat(value)) return [false, value];
  const parsedValue = parseFloat(value);
  const invalid = isNaN(parsedValue);
  return [invalid, parsedValue];
};

const parserMaker = options => {
  return (key, value) => {
    let parsedVal = options.default;

    let [err, result] = parseValue(value);

    if (!err) {
      const [, valid] = validate(key, value, options);
      if (valid) parsedVal = result;
    }

    // handle custom validation
    // custom validation must not return null|undefined|false to be valid
    if (!err && options.validate !== null) {
      if (isFunction(options.validate)) {
        const result = options.validate.call(null, parsedVal);
        if (isNil(result) || result === false) err = true;
      }
    }

    if (err) {
      parsedVal = isFunction(options.default)
        ? options.default.call(null)
        : options.default;
    }

    return [err, parsedVal];
  };
};

const validate = (
  key,
  value,
  options = { min: null, max: null, minDigits: null, maxDigits: null }
) => {
  const errorDetails = [];
  let { min, max, minDigits, maxDigits } = options;

  if (min && !isNumber(min)) {
    throw new TypeError(
      `Float: Invalid "min" option value for ${key}, it should be in numeric type!`
    );
  }
  if (max && !isNumber(max)) {
    throw new TypeError(
      `Float: Invalid "max" option value for ${key}, it should be in numeric type!`
    );
  }
  if (minDigits && !isNumber(minDigits)) {
    throw new TypeError(
      `Float: Invalid "minDigits" option value for ${key}, it should be in numeric type!`
    );
  }
  if (maxDigits && !isNumber(maxDigits)) {
    throw new TypeError(
      `Float: Invalid "maxDigits" option value for ${key}, it should be in numeric type!`
    );
  }

  if (min) min = parseNumericType(min);
  if (max) max = parseNumericType(max);
  if (minDigits) minDigits = parseNumericType(minDigits);
  if (maxDigits) parseNumericType(maxDigits);

  const validMin = min ? value >= min : true;
  if (!validMin) errorDetails.push(`Minimum value of "${key}" is ${min}`);

  const validMax = max ? value <= max : true;
  if (!validMax) errorDetails.push(`Maximum value of "${key}" is ${max}`);

  const validMinDigits = minDigits
    ? value.toString().split('.')[0].length >= minDigits
    : true;

  if (!validMinDigits) {
    errorDetails.push(`Minimum value of "${key}" is ${minDigits} digits`);
  }

  const validMaxDigits = maxDigits
    ? value.toString().split('.')[0].length <= maxDigits
    : true;
  if (!validMaxDigits) {
    errorDetails.push(`Maximum value of "${key}" is ${maxDigits} digits`);
  }

  const valid = validMin && validMax && validMinDigits && validMaxDigits;

  return [errorDetails, valid];
};

const getOptions = () =>
  combineDefaultOptions({
    min: null,
    max: null,
    minDigits: null,
    maxDigits: null
  });

const getTypeOptions = () => ({ isDirectValueSet: false });

const parseNumericType = value => {
  if (isString(value)) {
    const parsed = isStringFloat(value) ? parseFloat(value) : parseInt(value);
    return isNaN(parsed) ? null : parsed;
  }

  return isNumber(value) ? value : null;
};

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
