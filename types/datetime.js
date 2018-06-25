'use strict';

const moment = require('moment');
const { isNil } = require('lodash');
const { combineDefaultOptions, fetchProvidedOptions } = require('./utils');
const { isArray, isObject, isDate, isString } = require('./detector');

const isParamsValid = params => {
  if (isArray(params) && (params.length === 1 || params.length === 2)) {
    if (params.length === 2) {
      return isString(params[0]) && isObject(params[1]);
    }
    if (params.length === 1) return isObject(params[0]) || isString(params[0]);
  }

  return false;
};

const getDateParser = useTimezone => (useTimezone ? moment : moment.utc);

const getValidDate = (dateVal, format, useTimezone) => {
  try {
    // detect date by ISO 8601 or RFC 2822 Date time formats
    const dateParser = getDateParser(useTimezone);
    const ignoreSuppressWarning = true;
    const date = format
      ? dateParser(dateVal, format, ignoreSuppressWarning)
      : dateParser(dateVal, ignoreSuppressWarning);
    if (date.isValid()) return date;
  } catch (err) {
    return null;
  }
  return null;
};

const evaluatesDate = (dateVal, format, useTimezone) => {
  if (isString(dateVal) || isDate(dateVal)) {
    console.log(dateVal, format, useTimezone);
    return getValidDate(dateVal, format, useTimezone);
  }

  return null;
};

const parserMaker = (...params) => {
  if (params.length > 0 && !isParamsValid(params)) {
    throw new TypeError('Invalid setup for "date" type');
  }

  return (key, value) => {
    let parsedVal = null;

    const {
      parseFormat,
      returnFormat,
      timezoneAware,
      asMoment,
      dateOnly,
      timeOnly
    } = fetchProvidedOptions(getOptions(), params);

    parsedVal = evaluatesDate(value, parseFormat, timezoneAware);

    console.log('parsedVal: ', parsedVal);

    if (parsedVal !== null) {
      if (!asMoment) {
        parsedVal = parsedVal.format(
          !isNil(returnFormat) ? returnFormat : undefined
        );
      }

      if ((dateOnly || timeOnly) && !isString(parsedVal)) {
        parsedVal = parsedVal.format(dateOnly ? 'YYYY-MM-DD' : 'HH:mm:ss');
      }
    }

    return [parsedVal === null, parsedVal];
  };
};

const validate = (key, value, paramsOrOptions) => {
  const errorDetails = [];
  let valid = true;
  return [errorDetails, valid];
};

const getOptions = () =>
  combineDefaultOptions({
    parseFormat: null,
    returnFormat: null,
    timezoneAware: true,
    asMoment: false,
    dateOnly: false,
    timeOnly: false
  });

const getTypeOptions = () => ({ isDirectValueSet: true });

module.exports = {
  getTypeOptions,
  parserMaker,
  validate,
  getOptions
};
