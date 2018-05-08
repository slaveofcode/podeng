'use strict';

const { isFunction, isString } = require('./detector');
const _ = require('lodash');
const { combineDefaultOptions } = require('./utils');

const NORMALIZER = {
  trimmed: value => _.trim(value),
  uppercased: value => _.toUpper(value),
  lowercased: value => _.toLower(value),
  upper_first: value => _.upperFirst(value),
  upper_first_word: value => {
    let upperCasedFirst = [];
    _.forEach(value.split(/\s/g), v => upperCasedFirst.push(_.toUpper(v)));
    return upperCasedFirst.length > 0 ? upperCasedFirst.join(' ') : value;
  },
  lower_first: value => _.lowerFirst(value),
  lower_first_word: value => {
    let lowerCasedFirst = [];
    _.forEach(value.split(/\s/g), v => lowerCasedFirst.push(_.toLower(v)));
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

const handler = (
  options = combineDefaultOptions({
    min: null,
    max: null,
    normalize: null,
  }),
) => {
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

    return [err, parsedVal];
  };

  parser.isHideOnFail = options.hideOnFail;

  return parser;
};

module.exports = handler;
