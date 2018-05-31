'use strict';

const moment = require('moment');
const { forEach, isEqual } = require('lodash');
const {
  isArray,
  isString,
  isNumber,
  isBoolean,
  isDate,
  isObject,
  isFunction
} = require('../types/detector');
const { combineDefaultOptions, isBlueprintObject } = require('./utils');

const parseValue = (listOfConstants, value) => {
  let validValue = false;

  forEach(listOfConstants, constantValue => {
    if (!validValue) {
      if (
        isString(constantValue) ||
        isNumber(constantValue) ||
        isBoolean(constantValue)
      ) {
        validValue = value === constantValue;
      } else if (isDate(constantValue) || moment.isMoment(constantValue)) {
        validValue = moment(constantValue).isSame(value);
      } else if (isBlueprintObject(constantValue)) {
        const instance = constantValue.getInstance();
        const [err] = instance.normalize(value);
        validValue = err;
      } else if (isObject(constantValue)) {
        validValue = isEqual(constantValue, value);
      }
    }
  });

  return [validValue, value];
};

const parserMaker = paramsOrOptions => {
  return (key, value) => {
    let parsedVal = null;

    if (!isArray(paramsOrOptions) && !paramsOrOptions.list) {
      throw new TypeError(`List constant of ${key} is undefined!`);
    }

    const listConstants = Object.assign(
      [],
      isArray(paramsOrOptions) ? paramsOrOptions : paramsOrOptions.list
    );

    const [isValidValue, result] = parseValue(listConstants, value);

    if (isValidValue) parsedVal = result;

    if (!isValidValue && !isArray(paramsOrOptions)) {
      parsedVal = isFunction(paramsOrOptions.default)
        ? paramsOrOptions.default.call(null)
        : paramsOrOptions.default;
    }

    return [isValidValue, parsedVal];
  };
};

const validate = (key, value, paramsOrOptions) => {
  const errorDetails = [];
  let valid = false;

  if (isArray(paramsOrOptions)) {
    valid = parseValue(paramsOrOptions, value);
  } else if (paramsOrOptions.list) {
    valid = parseValue(paramsOrOptions.list, value);
  } else {
    throw new TypeError(`List constant of ${key} is undefined!`);
  }

  if (!valid) {
    errorDetails.push(`Value ${value} is not listed on constants of ${key}`);
  }

  return [errorDetails, valid];
};

const getOptions = () =>
  combineDefaultOptions({
    list: null
  });

const getTypeOptions = () => ({ isDirectValueSet: true });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
