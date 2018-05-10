'use strict';

const { isFunction, isString, isArray } = require('./detector');
const {
  trim,
  toUpper,
  toLower,
  upperFirst,
  forEach,
  lowerFirst,
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
  },
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

  const valid = validMin && validMax ? true : false;

  return [errorDetails, valid];
};

const handler = (options = {}) => {
  const defaultOptions = combineDefaultOptions({
    min: null,
    max: null,
    normalize: null,
  });
  options = Object.assign(defaultOptions, options);

  const parser = () => {};

  parser.validate = validate;

  parser.parse = (key, value) => {
    let parsedVal = options.default;

    const [err, result] = parseValue(
      value,
      options.hideOnFail ? false : options.stringify,
    );

    if (!err) {
      const [errorDetails, valid] = validate(key, value, options);
      if (valid) parsedVal = result;
    }

    // handle single normalization
    if (!err && options.normalize && NORMALIZER[options.normalize]) {
      parsedVal = NORMALIZER[options.normalize](parsedVal);
    }

    // handle multiple normalization
    if (!err && options.normalize && isArray(options.normalize)) {
      forEach(options.normalize, normalizeValue => {
        if (NORMALIZER[normalizeValue])
          parsedVal = NORMALIZER[normalizeValue](parsedVal);
      });
    }

    // handle custom normalization via custom function
    if (!err && options.normalize && isFunction(options.normalize)) {
      parsedVal = options.normalize(parsedVal);
    }

    if (err) {
      parsedVal = isFunction(options.default)
        ? options.default()
        : options.default;
    }

    return [err, parsedVal];
  };

  /**
   * General methods
   */
  parser.isHideOnFail = () => options.hideOnFail;

  return parser;
};

module.exports = handler;
