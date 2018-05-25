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

const EMBED_OPTIONS = {
  default: undefined,
  hideOnFail: false
};

const combineObjDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const combineExtDefaultOptions = options =>
  Object.assign({}, EXTEND_OPTIONS, options);

const combineEmbedDefaultOptions = options =>
  Object.assign({}, EMBED_OPTIONS, options);

module.exports = {
  combineObjDefaultOptions,
  combineExtDefaultOptions,
  combineEmbedDefaultOptions
};
