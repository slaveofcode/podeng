'use strict';

const { isFunction, isString, isArray } = require('./detector');
const {
  trim,
  toUpper,
  toLower,
  upperFirst,
  forEach,
  lowerFirst,
  isNil
} = require('lodash');
const { combineDefaultOptions } = require('./utils');

const NORMALIZER = {
  trimmed: value => trim(value),
  uppercased: value => toUpper(value),
  lowercased: value => toLower(value),
  upper_first: value => upperFirst(value),
  upper_first_word: value => {
    let upperCasedFirst = [];
    forEach(value.split(/\s/g), v => upperCasedFirst.push(upperFirst(v)));
    return upperCasedFirst.length > 0 ? upperCasedFirst.join(' ') : value;
  },
  lower_first: value => lowerFirst(value),
  lower_first_word: value => {
    let lowerCasedFirst = [];
    forEach(value.split(/\s/g), v => lowerCasedFirst.push(lowerFirst(v)));
    return lowerCasedFirst.length > 0 ? lowerCasedFirst.join(' ') : value;
  }
};

const parseValue = (value, stringify = true) => {
  let err = null;
  const parsedValue = isString(value)
    ? value
    : stringify
      ? JSON.stringify(value)
      : undefined;

  if (!parsedValue) err = true;
  return [err, parsedValue];
};

const validate = (key, value, options = { min: null, max: null }) => {
  const errorDetails = [];
  const { min, max } = options;

  const validMin = min ? value.length >= min : true;
  if (!validMin) errorDetails.push(`Minimum value of ${key} is ${min}`);

  const validMax = max ? value.length <= max : true;
  if (!validMax) errorDetails.push(`Maximum value of ${key} is ${max}`);

  const valid = !!(validMin && validMax);

  return [errorDetails, valid];
};

const getOptions = () =>
  combineDefaultOptions({
    stringify: true,
    min: null,
    max: null,
    normalize: null
  });

const parserMaker = options => {
  return (key, value) => {
    let parsedVal = options.default;

    /**
     * Disable stringify if "hideOnFail" value is true
     */
    const doStringify = options.hideOnFail ? false : options.stringify;
    let [err, result] = parseValue(value, doStringify);
    if (!err) {
      const [, valid] = validate(key, value, options);
      if (valid) parsedVal = result;
    }

    // handle single normalization
    if (!err && options.normalize && NORMALIZER[options.normalize]) {
      parsedVal = NORMALIZER[options.normalize](parsedVal);
    }

    // handle multiple normalization
    if (!err && options.normalize && isArray(options.normalize)) {
      forEach(options.normalize, normalizeValue => {
        if (NORMALIZER[normalizeValue]) {
          parsedVal = NORMALIZER[normalizeValue](parsedVal);
        }
      });
    }

    // handle custom normalization via custom function
    if (!err && options.normalize && isFunction(options.normalize)) {
      parsedVal = options.normalize(parsedVal);
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

const getTypeOptions = () => ({ isDirectValueSet: false });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
