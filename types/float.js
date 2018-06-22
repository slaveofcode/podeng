'use strict';

const { isNil } = require('lodash');
const { combineDefaultOptions } = require('./utils');
const {
  isFloat,
  isStringFloat,
  isFunction,
  isNumber
} = require('../types/detector');

const parseValue = value => {
  if (isFloat(value)) return [false, value];
  const parsedValue = parseInt(value);
  const invalid = isNaN(parsedValue) && !isFloat(parsedValue);
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
      `Integer: Invalid "min" option value for ${key}, it should be in numeric type!`
    );
  }
  if (max && !isNumber(max)) {
    throw new TypeError(
      `Integer: Invalid "max" option value for ${key}, it should be in numeric type!`
    );
  }
  if (minDigits && !isNumber(minDigits)) {
    throw new TypeError(
      `Integer: Invalid "minDigits" option value for ${key}, it should be in numeric type!`
    );
  }
  if (maxDigits && !isNumber(maxDigits)) {
    throw new TypeError(
      `Integer: Invalid "maxDigits" option value for ${key}, it should be in numeric type!`
    );
  }

  if (min) min = isStringFloat(min) ? parseFloat(min) : parseInt(min);
  if (max) max = isStringFloat(max) ? parseFloat(max) : parseInt(max);
  if (minDigits) {
    minDigits = isStringFloat(minDigits)
      ? parseFloat(minDigits)
      : parseInt(minDigits);
  }
  if (maxDigits) {
    maxDigits = isStringFloat(maxDigits)
      ? parseFloat(maxDigits)
      : parseInt(maxDigits);
  }

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

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
