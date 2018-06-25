'use strict';

const { combineDefaultOptions } = require('./utils');
const { isFunction, isArray, isObject } = require('./detector');

const isParamsValid = params => {
  if (isArray(params) && (params.length === 1 || params.length === 2)) {
    if (params.length === 2) {
      return isObject(params[1]);
    }
    return true;
  }
  return false;
};

const parserMaker = (...params) => {
  if (!isParamsValid(params)) {
    throw new TypeError('Invalid setup for "transform" type');
  }

  return (key, value) => {
    let parsedVal = null;

    parsedVal = isFunction(params[0])
      ? params[0].apply(null, [value])
      : params[0];

    return [parsedVal === null, parsedVal];
  };
};

const validate = (key, value, paramsOrOptions) => {
  return [[], true];
};

const getOptions = () => combineDefaultOptions();

const getTypeOptions = () => ({ isDirectValueSet: true });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
