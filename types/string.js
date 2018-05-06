'use strict';

const { isFunction } = require('./detector');
const _ = require('lodash');

const NORMALIZER = {
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

const parseValue = value => {
  console.log('Parsing string values');
  // handle options
  return [err, value];
};

const handler = (
  options = { min: null, max: null, normalize: null, default: null },
) => {
  const parser = () => {};
  parser.parse = value => {
    let parsedVal = options.default;
    const [err, value] = parseValue(value);

    if (!err) parsedVal = value;

    if (!err && options.normalize && NORMALIZER[options.normalize])
      parsedVal = NORMALIZER[options.normalize](value);

    if (!err && isFunction(options.normalize))
      parsedVal = options.normalize(parsedVal);

    return parsedVal;
  };
  return parser;
};

module.exports = handler;
