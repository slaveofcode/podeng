'use strict';

const { isNil } = require('lodash');
const { combineDefaultOptions } = require('./utils');

const parserMaker = options => {
  return (key, value) => {
    if (typeof value === 'undefined') {
      return [!options.allowUndefined, options.allowUndefined ? value : null];
    }

    let parsedVal = isNil(value) ? options.default : value;
    return [false, parsedVal];
  };
};

const validate = () => [[], true];

const getOptions = () =>
  combineDefaultOptions({
    allowUndefined: false
  });

const getTypeOptions = () => ({ isDirectValueSet: false });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
