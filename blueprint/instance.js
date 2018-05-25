'use strict';

const { isArray, isFunction, isUndefined } = require('../types/detector');
const { includes, keys, forEach, difference, pick } = require('lodash');

const cls = function (schema, options = {}, { isArray = false }) {
  this.isArray = isArray;
  this.schema = schema;
  this.options = options;
  this.normalize = normalizeValue;
  this.serialize = serializeValue;
  this.deserialize = deserializeValue;
};

const embedCls = function (instanceCls, options = {}) {
  this.options = options;
  this.instance = instanceCls;

  this.getOptions = function () {
    return this.options;
  };
  this.getObject = function () {
    return this.instance;
  };
};

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
  (isFunction(obj.embed) && obj.embed() instanceof embedCls
    ? obj.embed()
    : obj instanceof embedCls ? obj : null);

/**
 * Normalizing embedded object
 * @param {*} embedObj
 * @param {*} valueToNormalize
 */
const normalizeEmbedValue = (embedObj, valueToNormalize) => {
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

  if (valueToNormalize) {
    // treat different action if value is not valid for array blueprint
    // because executing wrong value type (not array) on array object will cause exception
    if (embedInstance.isArray && !isArray(valueToNormalize)) {
      result = resolveEmptyValue();
    } else {
      // calling normalize function on parent blueprint obj
      const [fail, , normalizedValues] = embedInstance.normalize(
        valueToNormalize
      );

      // applying embed object options
      if (!fail || (fail && !embedOptions.hideOnFail)) {
        result = normalizedValues;
      }
    }
  } else {
    if (!embedOptions.hideOnFail) {
      result = resolveEmptyValue();
    }
  }

  return result;
};

const normalizeValue = function (valuesToNormalize) {
  if (this.isArray && !isArray(valuesToNormalize)) {
    throw new TypeError('Wrong value type, you must supply array values!');
  }

  const normalize = (objValue, schema) => {
    const normalized = {};
    const errorResults = {};

    forEach(schema, (typeHandler, key) => {
      // checking handler is an embedded class
      // so we do recursive operation
      const embedObj = resolveEmbededObj(typeHandler);
      if (embedObj !== null) {
        const embedValue = objValue[key];

        const result = normalizeEmbedValue(embedObj, embedValue);

        if (result !== null) normalized[key] = result;
      } else {
        const handler = initiateTypeHandler(typeHandler);

        const [fail, normalizedValue] = handler.parse(key, objValue[key]);
        if (!fail || (fail && !handler.isHideOnFail())) {
          normalized[key] = normalizedValue;
        }

        if (fail) errorResults[key] = `failed to parse ${key} as a String type`;
      }
    });

    return [errorResults, normalized];
  };

  const handleUnknownProperties = (valuesToNormalize, schema) => {
    const registeredKeys = keys(schema);
    const givenKeys = keys(valuesToNormalize);
    const unknownProperties = difference(givenKeys, registeredKeys);
    return pick(valuesToNormalize, unknownProperties);
  };

  const isAllowUnknownProperties = this.options.allowUnknownProperties;

  if (!this.isArray) {
    const [errors, normalizedResult] = normalize(valuesToNormalize, this.schema);

    if (isAllowUnknownProperties) {
      Object.assign(
        normalizedResult,
        handleUnknownProperties(valuesToNormalize, this.schema)
      );
    }

    return [keys(errors).length > 0, errors, normalizedResult];
  } else {
    const results = valuesToNormalize.map(v => {
      const normalizedResult = normalize(v, this.schema);
      if (isAllowUnknownProperties) {
        Object.assign(
          normalizedResult,
          handleUnknownProperties(valuesToNormalize, this.schema)
        );
      }
      return normalizedResult;
    });
    const allErrors = [];
    const normalizedResults = [];

    forEach(results, ([errors, normalized]) => {
      if (errors.length > 0) allErrors.push(errors);
      normalizedResults.push(normalized);
    });

    return [allErrors.length > 0, allErrors, normalizedResults];
  }
};

const serializeValue = function (valuesToSerialize) {
  const serialized = {};
  const [isError, errorDetails, normalizedValues] = this.normalize(
    valuesToSerialize
  );

  const normalizedKeys = Object.keys(normalizedValues);
  forEach(this.schema, (typeHandler, key) => {
    const handler = initiateTypeHandler(typeHandler);
    if (includes(normalizedKeys, key) && !handler.isHideOnSerialization()) {
      const serializeTo = handler.getSerializeName();
      if (serializeTo !== null) {
        serialized[serializeTo] = normalizedValues[key];
      } else {
        serialized[key] = normalizedValues[key];
      }
    }
  });

  const diffsSchema = difference(keys(valuesToSerialize), keys(this.schema));
  const diffsSerialize = difference(diffsSchema, keys(serialized));
  if (this.options.allowUnknownProperties) {
    Object.assign(serialized, pick(valuesToSerialize, diffsSerialize));
  }

  return [isError, errorDetails, serialized];
};

const deserializeValue = function (valuesToDeserialize) {
  if (this.isArray && !isArray(valuesToDeserialize)) {
    throw new TypeError('Wrong value type, you must supply array values!');
  }

  const deserialize = (objValue, schema) => {
    const deserialized = {};
    const errorResults = {};

    forEach(schema, (typeHandler, key) => {
      const handler = initiateTypeHandler(typeHandler);

      const deserializeFrom = handler.getDeserializeName() === null
        ? handler.getSerializeName() === null ? key : handler.getSerializeName()
        : handler.getDeserializeName();

      const [fail, normalizedValue] = handler.parse(
        deserializeFrom,
        objValue[deserializeFrom]
      );

      if (!fail || (fail && !handler.isHideOnFail())) {
        if (!handler.isHideOnSerialization()) {
          deserialized[key] = normalizedValue;
        }
      }

      if (fail) errorResults[key] = `failed to parse ${key} as a String type`;
    });

    return [errorResults, deserialized];
  };

  if (!this.isArray) {
    const [errors, normalizedResult] = deserialize(
      valuesToDeserialize,
      this.schema
    );
    return [keys(errors).length > 0, errors, normalizedResult];
  } else {
    const results = valuesToDeserialize.map(v => deserialize(v, this.schema));
    const allErrors = [];
    const normalizedResults = [];

    forEach(results, ([errors, normalized]) => {
      if (errors.length > 0) allErrors.push(errors);
      normalizedResults.push(normalized);
    });

    return [allErrors.length > 0, allErrors, normalizedResults];
  }
};

module.exports = {
  cls,
  embedCls
};
