'use strict';

const moment = require('moment');
const { forEach, isEqual } = require('lodash');
const {
  isArray,
  isString,
  isNumber,
  isBoolean,
  isDate,
  isObject
} = require('../types/detector');
const { combineDefaultOptions, isBlueprintObject } = require('./utils');

const parseValue = (paramsOrOptions, value) => {
  let valid = false;

  forEach(paramsOrOptions, constantValue => {
    if (!valid) {
      if (
        isString(constantValue) ||
        isNumber(constantValue) ||
        isBoolean(constantValue)
      ) {
        valid = value === constantValue;
      } else if (isDate(constantValue) || moment.isMoment(constantValue)) {
        valid = moment(constantValue).isSame(value);
      } else if (isBlueprintObject(constantValue)) {
        const instance = constantValue.getInstance();
        const [err] = instance.normalize(value);
        valid = err;
      } else if (isObject(constantValue)) {
        valid = isEqual(constantValue, paramsOrOptions);
      }
    }
  });

  return [valid, paramsOrOptions];
};

const parserMaker = paramsOrOptions => {
  return (key, value) => {
    if (isArray(paramsOrOptions)) {
      return parseValue(paramsOrOptions, value);
    } else if (paramsOrOptions.list) {
      return parseValue(paramsOrOptions.list, value);
    } else {
      throw new TypeError(`List constant of ${key} is undefined!`);
    }
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

  if (!valid) { errorDetails.push(`Value ${value} is not listed on constants of ${key}`); }

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
