'use strict';

const { isArray } = require('../types/detector');
const { combineDefaultOptions } = require('./utils');

const parserMaker = paramsOrOptions => {
  return (key, value) => {
    if (isArray(paramsOrOptions)) {
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
