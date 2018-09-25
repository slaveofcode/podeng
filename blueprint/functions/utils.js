'use strict';

const BlueprintEmbedClass = require('../base/embedCls');
const { includes, keys, difference, pick } = require('lodash');
const { isArray, isFunction, isUndefined } = require('../../types/detector');

/**
 * Resolving type handler, if user didn't execute the function
 * it will be auto initialized
 * @param {*} typehandler
 */
const initiateTypeHandler = typehandler => {
  if (includes(keys(typehandler), 'parse')) {
    return typehandler;
  } else {
    return typehandler();
  }
};

/**
 * Detect & returning embedded object
 * @param {embedCls} embeddedObject
 */
const resolveEmbededObj = obj =>
  (isFunction(obj.embed) && obj.embed() instanceof BlueprintEmbedClass
    ? obj.embed()
    : obj instanceof BlueprintEmbedClass ? obj : null);

const handleUnknownProperties = (params, objToExclude) => {
  const registeredKeys = keys(objToExclude);
  const paramKeys = keys(params);
  const unknownProperties = difference(paramKeys, registeredKeys);
  return pick(params, unknownProperties);
};

/**
 * Normalizing embedded object
 * @param {*} embedObj
 * @param {*} valueToParse
 */
const parseEmbedValue = (clsMethodName, embedObj, valueToParse) => {
  const embedInstance = embedObj.getObject();
  const embedOptions = embedObj.getOptions();
  let result = null;

  // resolving empty value based on embed options
  const resolveEmptyValue = () => {
    const defaultValue = embedOptions.default;
    if (isUndefined(defaultValue)) {
      return embedInstance.isArray ? [] : null;
    } else {
      return defaultValue;
    }
  };

  if (valueToParse) {
    // treat different action if value is not valid for array blueprint
    // because executing wrong value type (not array) on array object will cause exception
    if (embedInstance.isArray && !isArray(valueToParse)) {
      result = resolveEmptyValue();
    } else {
      // calling normalize/serialize/deserialize function on parent blueprint obj
      const [fail, , parsedValues] = embedInstance[clsMethodName](
        valueToParse
      );

      // applying embed object options
      if (!fail || (fail && !embedOptions.hideOnFail)) {
        result = parsedValues;
      }
    }
  } else {
    if (!embedOptions.hideOnFail) {
      result = resolveEmptyValue();
    }
  }

  return result;
};

module.exports = {
  initiateTypeHandler,
  resolveEmbededObj,
  handleUnknownProperties,
  parseEmbedValue
};
