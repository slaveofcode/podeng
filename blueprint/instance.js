'use strict';

const { isArray, isFunction, isUndefined } = require('../types/detector');
const { includes, keys, forEach, difference, pick, omit } = require('lodash');

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

const handleUnknownProperties = (params, objToExclude) => {
  const registeredKeys = keys(objToExclude);
  const paramKeys = keys(params);
  const unknownProperties = difference(paramKeys, registeredKeys);
  return pick(params, unknownProperties);
};

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

        if (fail) errorResults[key] = `failed to parse "${key}" with its type`;
      }
    });

    return [errorResults, normalized];
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
      const [errorDetails, normalizedResult] = normalize(v, this.schema);
      if (isAllowUnknownProperties) {
        Object.assign(normalizedResult, handleUnknownProperties(v, this.schema));
      }
      return [errorDetails, normalizedResult];
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
  let serialized = this.isArray ? [] : {};
  const [isError, errorDetails, normalizedValues] = this.normalize(
    valuesToSerialize
  );

  const isAllowUnknownProperties = this.options.allowUnknownProperties;

  const serialize = (normalizedValues, schema) => {
    const serialized = {};
    const normalizedKeys = Object.keys(normalizedValues);

    forEach(schema, (typeHandler, key) => {
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

    return serialized;
  };

  if (this.isArray) {
    forEach(normalizedValues, v => {
      const serializeResult = serialize(v, this.schema);

      if (isAllowUnknownProperties) {
        Object.assign(serializeResult, handleUnknownProperties(v, this.schema));
      }

      serialized.push(serializeResult);
    });
  } else {
    serialized = serialize(normalizedValues, this.schema);
    if (isAllowUnknownProperties) {
      Object.assign(
        serialized,
        handleUnknownProperties(normalizedValues, this.schema)
      );
    }
  }

  return [isError, errorDetails, serialized];
};

const deserializeValue = function (valuesToDeserialize) {
  if (this.isArray && !isArray(valuesToDeserialize)) {
    throw new TypeError('Wrong value type, you must supply array values!');
  }

  const getDeserializedKeys = (objValue, schema) => {
    const deserializedNames = [];
    forEach(schema, (typeHandler, key) => {
      const handler = initiateTypeHandler(typeHandler);
      const deserializeFrom = handler.getDeserializeName() === null
        ? handler.getSerializeName() === null ? key : handler.getSerializeName()
        : handler.getDeserializeName();
      deserializedNames.push(deserializeFrom);
    });
    return deserializedNames;
  };

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

  const isAllowUnknownProperties = this.options.allowUnknownProperties;

  if (!this.isArray) {
    const [errors, deserializedResult] = deserialize(
      valuesToDeserialize,
      this.schema
    );

    if (isAllowUnknownProperties) {
      const deserializedKeys = getDeserializedKeys(
        valuesToDeserialize,
        this.schema
      );
      Object.assign(
        deserializedResult,
        omit(
          handleUnknownProperties(valuesToDeserialize, this.schema),
          deserializedKeys
        )
      );
    }

    return [keys(errors).length > 0, errors, deserializedResult];
  } else {
    const results = valuesToDeserialize.map(v => {
      const [errorDetails, deserializedResult] = deserialize(v, this.schema);
      if (isAllowUnknownProperties) {
        const deserializedKeys = getDeserializedKeys(v, this.schema);
        Object.assign(
          deserializedResult,
          omit(handleUnknownProperties(v, this.schema), deserializedKeys)
        );
      }
      return [errorDetails, deserializedResult];
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

module.exports = {
  cls,
  embedCls
};
