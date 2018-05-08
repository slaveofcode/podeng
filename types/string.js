'use strict';

const { isFunction, isString } = require('./detector');
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
    forEach(value.split(/\s/g), v => upperCasedFirst.push(toUpper(v)));
    return upperCasedFirst.length > 0 ? upperCasedFirst.join(' ') : value;
  },
  lower_first: value => lowerFirst(value),
  lower_first_word: value => {
    let lowerCasedFirst = [];
    forEach(value.split(/\s/g), v => lowerCasedFirst.push(toLower(v)));
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

const handler = (options = {}) => {
  const defaultOptions = combineDefaultOptions({
    min: null,
    max: null,
    normalize: null,
  });
  options = Object.assign(defaultOptions, options);

  const parser = () => {};
  parser.parse = value => {
    let parsedVal = options.default;

    /**
     * TODO: Validation min, max here
     */

    const [err, result] = parseValue(value, options.stringify);

    if (!err) parsedVal = result;

    if (!err && options.normalize && NORMALIZER[options.normalize]) {
      parsedVal = NORMALIZER[options.normalize](parsedVal);
    }

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

  parser.isHideOnFail = () => options.hideOnFail;

  return parser;
};

module.exports = handler;
