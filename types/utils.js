'use strict';

const { includes, keys, intersection, forEach } = require('lodash');
const { cls: BlueprintClass } = require('../blueprint/instance');
const { isFunction, isObject } = require('./detector');

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

const fetchProvidedOptions = (options, params) => {
  const defaultOptionList = keys(options);
  const objOptions = {};

  for (let i = 0; i < params.length; i++) {
    if (isObject(params[i])) {
      const givenOpts = intersection(keys(params[i]), defaultOptionList);

      if (givenOpts.length > 0) {
        forEach(givenOpts, key => {
          objOptions[key] = params[i][key];
        });
      }
    }
  }

  return Object.assign({}, options, objOptions);
};

module.exports = {
  combineDefaultOptions,
  isBlueprintObject,
  fetchProvidedOptions
};
