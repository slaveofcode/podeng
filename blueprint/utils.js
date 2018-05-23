'use strict';

const DEFAULT_OPTIONS = {
  frozen: true,
  giveWarning: false,
  onError: {},
  throwOnError: false
};

const EXTEND_OPTIONS = {
  deleteProperties: []
};

const combineObjDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const combineExtDefaultOptions = options =>
  Object.assign({}, EXTEND_OPTIONS, options);

module.exports = {
  combineObjDefaultOptions,
  combineExtDefaultOptions
};
