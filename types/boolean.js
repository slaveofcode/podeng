'use strict';

const { combineDefaultOptions } = require('./utils');
const { isArray, isObject, isBoolean, isString } = require('./detector');

const isValidObjectOptions = arg =>
  isObject(arg) && (arg.validList || arg.invalidList);
const isValidArrayOptions = arg => isArray(arg) && arg.length > 0;

const isParamsValid = params => {
  if (isArray(params) && (params.length === 1 || params.length === 2)) {
    if (params.length === 1) {
      const objArg = params[0];
      return isValidArrayOptions(objArg) || isValidObjectOptions(objArg);
    } else if (params.length === 2) {
      return (
        isArray(params[0]) &&
        isArray(params[1]) &&
        params[0].length > 0 &&
        params[1].length > 0
      );
    } else {
      return false;
    }
  }

  return false;
};

const extractValidList = params => {
  if (params.length === 0) return [];
  return isValidArrayOptions(params[0])
    ? params[0]
    : isValidObjectOptions(params[0]) && params[0].validList
      ? params[0].validList
      : [];
};

const extractInvalidList = params => {
  if (
    isArray(params) &&
    params.length > 0 &&
    !isObject(params[0]) &&
    params.length !== 2
  ) {
    return [];
  }

  return isValidArrayOptions(params[1])
    ? params[1]
    : isValidObjectOptions(params[0]) && params[0].invalidList
      ? params[0].invalidList
      : [];
};

const isCaseSensitiveListing = params => {
  if (
    params.length === 1 &&
    isObject(params[0]) &&
    params[0].hasOwnProperty('caseSensitive')
  ) {
    return params[0].caseSensitive;
  }
  return getOptions().caseSensitive;
};

const evaluatesCondition = (value, validList, invalidList, caseSensitive) => {
  if (isBoolean(value)) return value;

  if (validList.length > 0) {
    if (!caseSensitive) {
      validList = validList.map(
        item => (isString(item) ? item.toLowerCase() : item)
      );
    }
    return validList.includes(value);
  } else if (invalidList.length > 0) {
    if (!caseSensitive) {
      invalidList = invalidList.map(
        item => (isString(item) ? item.toLowerCase() : item)
      );
    }
    return !invalidList.includes(value);
  }

  return false;
};

const parserMaker = (...params) => {
  if (params.length > 0 && !isParamsValid(params)) {
    throw new TypeError('Invalid setup for "bool" type');
  }

  return (key, value) => {
    let parsedVal = null;

    const validList = extractValidList(params);
    const invalidList = extractInvalidList(params);
    const isCaseSensitive = isCaseSensitiveListing(params);

    parsedVal = evaluatesCondition(
      value,
      validList,
      invalidList,
      isCaseSensitive
    );

    return [parsedVal === null, parsedVal];
  };
};

const validate = (key, value, paramsOrOptions) => {};

const getOptions = () =>
  combineDefaultOptions({
    validList: null,
    invalidList: null,
    caseSensitive: true
  });

const getTypeOptions = () => ({ isDirectValueSet: true });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
