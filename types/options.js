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

const parseValue = (listOfOptions, value) => {
  let validValue = false;

  forEach(listOfOptions, optionValue => {
    if (!validValue) {
      if (
        isString(optionValue) ||
        isNumber(optionValue) ||
        isBoolean(optionValue)
      ) {
        validValue = value === optionValue;
      } else if (isDate(optionValue) || moment.isMoment(optionValue)) {
        validValue = moment(optionValue).isSame(value);
      } else if (isBlueprintObject(optionValue)) {
        const instance = optionValue.getInstance();
        const [gotError] = instance.normalize(value);
        validValue = !gotError;
      } else if (isObject(optionValue)) {
        validValue = isEqual(optionValue, value);
      }
    }
  });

  return [validValue, value];
};

const parserMaker = paramsOrOptions => {
  return (key, value) => {
    let parsedVal = null;

    if (!isArray(paramsOrOptions) && !paramsOrOptions.list) {
      throw new TypeError(`List options of ${key} is undefined!`);
    }

    const listOptions = Object.assign(
      [],
      isArray(paramsOrOptions) ? paramsOrOptions : paramsOrOptions.list
    );

    const [isValidValue, result] = parseValue(listOptions, value);

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
    throw new TypeError(`List options of ${key} is undefined!`);
  }

  if (!valid) {
    errorDetails.push(`Value ${value} is not listed on options of ${key}`);
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
