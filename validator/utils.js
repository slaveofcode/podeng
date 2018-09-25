'use strict';

const { isBlueprintObject } = require('../types/utils');

const DEFAULT_OPTIONS = {
  allowUnknownProperties: true,
  customThrowMessage: null,
  deserialization: false
};

const combineDefaultOptions = options =>
  Object.assign({}, DEFAULT_OPTIONS, options);

const makeError = errorName => {
  return (message, { details, object }) => {
    const error = new Error(message);
    error.isPodeng = true;
    error.name = errorName;

    if (details) error.details = details;

    if (object) error._object = object;

    return error;
  };
};

module.exports = {
  isBlueprintObject,
  combineDefaultOptions,
  makeError
};
