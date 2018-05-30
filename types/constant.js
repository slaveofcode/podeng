'use strict';

const moment = require('moment');
const { forEach } = require('lodash');
const {
  isArray,
  isString,
  isNumber,
  isBoolean,
  isDate
} = require('../types/detector');
const { combineDefaultOptions } = require('./utils');
const { isBlueprintObject } = require('./utils');

const parserMaker = paramsOrOptions => {
  return (key, value) => {
    if (isArray(paramsOrOptions)) {
      let valid = false, errorDetails = [];

      forEach(paramsOrOptions, constantValue => {
        if (!valid) {
          if (
            isString(constantValue) ||
            isNumber(constantValue) ||
            isBoolean(constantValue)
          ) {
            valid = value === constantValue;
          } else if (isDate(constantValue) || moment.isMoment(constantValue)) {
          } else if (isBlueprintObject(constantValue)) {
          }
        }
      });

      return [errorDetails, valid];
    }
  };
};

const validate = () => {};

const getOptions = () =>
  combineDefaultOptions({
    min: null,
    max: null,
    minDigits: null,
    maxDigits: null
  });

const getTypeOptions = () => ({ isDirectValueSet: true });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
