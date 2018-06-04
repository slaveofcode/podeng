'use strict';

const { includes, keys } = require('lodash');
const { cls: BlueprintClass } = require('../blueprint/instance');
const { isFunction } = require('../types/detector');

const DEFAULT_OPTIONS = {
  hideOnFail: false,
  default: null,
  validate: null,
  serialize: {
    to: null,
    display: true
  },
  deserialize: {
    from: null,
    display: true
  }
};

const combineDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const isBlueprintObject = obj => {
  const isValidFunction =
    includes(keys(obj), 'getHandler') &&
    isFunction(obj.getHandler) &&
    includes(keys(obj), 'getInstance') &&
    isFunction(obj.getInstance);
  return isValidFunction ? obj.getInstance() instanceof BlueprintClass : false;
};

module.exports = {
  combineDefaultOptions,
  isBlueprintObject
};
