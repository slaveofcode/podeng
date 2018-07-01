'use strict';

const moment = require('moment');
const { isNil } = require('lodash');
const { combineDefaultOptions, fetchProvidedOptions } = require('./utils');
const { isArray, isObject, isDate, isString } = require('./detector');

moment.suppressDeprecationWarnings = true;

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
    const strict = true;
    const date = dateParser(
      dateVal,
      !isNil(format) ? format : undefined,
      strict
    );

    if (date.isValid()) return date;
  } catch (err) {
    return null;
  }
  return null;
};

const evaluatesDate = (dateVal, format, useTimezone) => {
  if (isString(dateVal) || isDate(dateVal)) {
    return getValidDate(dateVal, format, useTimezone);
  }

  return null;
};

const getDateFormat = (parseFormat, params) => {
  return !parseFormat
    ? isString(params[0])
      ? params[0]
      : parseFormat
    : parseFormat;
};

const parserMaker = (...params) => {
  if (params.length > 0 && !isParamsValid(params)) {
    throw new TypeError('Invalid setup for "date" type');
  }

  return (key, value) => {
    let parsedVal = null;
    let dateReturnFormat;

    const {
      parseFormat,
      returnFormat,
      timezoneAware,
      asMoment,
      dateOnly,
      timeOnly
    } = fetchProvidedOptions(getOptions(), params);

    dateReturnFormat = returnFormat;

    // get format string from index params 0 if detected as string
    const strFormat = getDateFormat(parseFormat, params);
    parsedVal = evaluatesDate(value, strFormat, timezoneAware);

    if (dateOnly || timeOnly) {
      dateReturnFormat = dateOnly
        ? isString(dateOnly)
          ? dateOnly
          : 'YYYY-MM-DD'
        : isString(timeOnly)
          ? timeOnly
          : 'HH:mm:ss';
    }

    if (parsedVal !== null) {
      if (!asMoment) {
        parsedVal = parsedVal.format(
          !isNil(dateReturnFormat) ? dateReturnFormat : undefined
        );
      }
    }

    return [parsedVal === null, parsedVal];
  };
};

const validate = (key, value, paramsOrOptions) => {
  const errorDetails = [];
  let valid = true;

  const { parseFormat, timezoneAware } = paramsOrOptions;

  const strFormat = getDateFormat(parseFormat, paramsOrOptions);
  valid = evaluatesDate(value, strFormat, timezoneAware) !== null;

  if (!valid) {
    errorDetails.push(`Unable to parse "${key}" with value: ${value}`);
  }

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
