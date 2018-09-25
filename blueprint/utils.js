'use strict';

const { includes, keys } = require('lodash');

const DEFAULT_OPTIONS = {
  frozen: true,
  giveWarning: false,
  onError: {},
  throwOnError: false,
  allowUnknownProperties: false
};

const EXTEND_OPTIONS = {
  deleteProperties: []
};

const EMBED_OPTIONS = {
  default: undefined,
  hideOnFail: false,
  serialize: {
    to: null,
    display: true
  },
  deserialize: {
    from: null,
    display: true
  }
};

const combineObjDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const combineExtDefaultOptions = options =>
  Object.assign({}, EXTEND_OPTIONS, options);

const combineEmbedDefaultOptions = options =>
  Object.assign({}, EMBED_OPTIONS, options);

const isTypeObject = obj => {
  const incMethod = name => {
    return includes(keys(obj), name);
  };
  return (
    incMethod('parse') &&
    incMethod('validate') &&
    incMethod('getSerializeName') &&
    incMethod('getDeserializeName') &&
    incMethod('isHideOnSerialization') &&
    incMethod('isHideOnDeserialization') &&
    incMethod('isHideOnFail') &&
    incMethod('getOptions')
  );
};

module.exports = {
  combineObjDefaultOptions,
  combineExtDefaultOptions,
  combineEmbedDefaultOptions,
  isTypeObject
};
