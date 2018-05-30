'use strict';

const { combineDefaultOptions } = require('./utils');
const { isInt, isFunction, isNil, isNumber } = require('../types/detector');

const parseValue = value => {
  if (isInt(value)) return value;
  const parsedValue = parseInt(value);
  const invalid = isNaN(parsedValue) && !isInt(parsedValue);
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
  const { min, max, minDigits, maxDigits } = options;

  if (min && !isNumber(min)) {
    throw new TypeError(
      `Invalid "min" option value for ${key}, it should be in numeric type!`
    );
  }
  if (max && !isNumber(max)) {
    throw new TypeError(
      `Invalid "max" option value for ${key}, it should be in numeric type!`
    );
  }
  if (minDigits && !isNumber(minDigits)) {
    throw new TypeError(
      `Invalid "minDigits" option value for ${key}, it should be in numeric type!`
    );
  }
  if (maxDigits && !isNumber(maxDigits)) {
    throw new TypeError(
      `Invalid "maxDigits" option value for ${key}, it should be in numeric type!`
    );
  }

  const validMin = min ? value >= min : true;
  if (!validMin) errorDetails.push(`Minimum value of ${key} is ${min}`);

  const validMax = max ? value <= max : true;
  if (!validMax) errorDetails.push(`Maximum value of ${key} is ${max}`);

  const validMinDigits = minDigits ? value.toString().length >= minDigits : true;
  if (!validMinDigits) {
    errorDetails.push(`Minimum value of ${key} is ${minDigits} digits`);
  }

  const validMaxDigits = maxDigits ? value.toString().length >= maxDigits : true;
  if (!validMaxDigits) {
    errorDetails.push(`Maximum value of ${key} is ${maxDigits} digits`);
  }

  const valid = validMin && validMax;

  return [errorDetails, valid];
};

const getOptions = () =>
  combineDefaultOptions({
    min: null,
    max: null,
    minDigits: null,
    maxDigits: null
  });

module.exports = {
  parserMaker,
  validate,
  getOptions
};
