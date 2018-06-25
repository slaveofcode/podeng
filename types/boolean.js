'use strict';

const { isNil, difference, keys } = require('lodash');
const { combineDefaultOptions } = require('./utils');
const { isArray, isObject, isBoolean, isString } = require('./detector');

const isValidObjectOptions = arg => {
  const options = keys(getOptions());
  const hasOptions = args =>
    difference(options, keys(args)).length < options.length;
  return isObject(arg) && hasOptions(arg);
};

const isValidArrayOptions = arg => isArray(arg) && arg.length > 0;

const isParamsValid = params => {
  if (isArray(params) && (params.length === 1 || params.length === 2)) {
    if (params.length === 1) {
      const objArg = params[0];
      return isValidArrayOptions(objArg) || isValidObjectOptions(objArg);
    } else if (params.length === 2) {
      if (isArray(params[0]) && isArray(params[1])) {
        return params[0].length > 0 && params[1].length > 0;
      } else if (isArray(params[0]) && isObject(params[1])) {
        return params[0].length > 0;
      }
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

const checkObjectPropertyExist = (params, propertyName) => {
  // Repeat over the length of params
  for (let i = 0; i < params.length; i++) {
    if (isObject(params[i]) && params[i].hasOwnProperty(propertyName)) {
      return params[i][propertyName];
    }
  }
  return null;
};

const isCaseSensitiveListing = params => {
  const caseSensitive = checkObjectPropertyExist(params, 'caseSensitive');
  return caseSensitive === null ? getOptions().caseSensitive : caseSensitive;
};

const isNotNil = params => {
  const trueExceptNil = checkObjectPropertyExist(params, 'trueExceptNil');
  return trueExceptNil === null ? getOptions().trueExceptNil : trueExceptNil;
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
    let parsedVal = false;

    const validList = extractValidList(params);
    const invalidList = extractInvalidList(params);
    const isCaseSensitive = isCaseSensitiveListing(params);
    const trueExceptNil = isNotNil(params);

    if (
      (!validList || validList.length === 0) &&
      (!invalidList || invalidList.length === 0) &&
      trueExceptNil
    ) {
      return [isNil(value), !isNil(value)];
    }

    parsedVal = evaluatesCondition(
      value,
      validList,
      invalidList,
      isCaseSensitive
    );

    return [parsedVal === null, parsedVal];
  };
};

const validate = (key, value, paramsOrOptions) => {
  const errorDetails = [];
  const valid = true;
  return [errorDetails, valid];
};

const getOptions = () =>
  combineDefaultOptions({
    validList: null,
    invalidList: null,
    caseSensitive: true,
    trueExceptNil: false // doesn't effect if has validList and/or invalidList setup before
  });

const getTypeOptions = () => ({ isDirectValueSet: true });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
