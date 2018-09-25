'use strict';

const { keys, forEach, omit } = require('lodash');
const { isArray } = require('../../types/detector');
const { isTypeObject } = require('../utils');
const { resolveEmbededObj, parseEmbedValue, initiateTypeHandler, handleUnknownProperties } = require('./utils');

const deserializeValue = function (valuesToDeserialize, onValidation = false) {
  if (this.isArray && !isArray(valuesToDeserialize)) {
    throw new TypeError('Wrong value type, you must supply array values!');
  }

  const getDeserializedKeys = (objValue, schema) => {
    const deserializedNames = [];
    forEach(schema, (typeHandler, key) => {
      const type = initiateTypeHandler(typeHandler);
      const deserializeFrom = type.getDeserializeName() === null
        ? type.getSerializeName() === null ? key : type.getSerializeName()
        : type.getDeserializeName();
      deserializedNames.push(deserializeFrom);
    });
    return deserializedNames;
  };

  const deserialize = (objValue, schema, config = { doValidation: false }) => {
    const deserialized = {};
    const errorResults = {};

    forEach(schema, (typeHandler, key) => {
      const errorList = [];
      let deserializeFrom = key;

      const embedObj = resolveEmbededObj(typeHandler);
      if (embedObj !== null) {
        deserializeFrom = embedObj.getDeserializeName() === null
          ? (embedObj.getSerializeName() === null ? key : embedObj.getSerializeName())
          : embedObj.getDeserializeName();
        const deserializedResult = parseEmbedValue('deserialize', embedObj, objValue[deserializeFrom]);
        if (!embedObj.isHideOnDeserialization()) {
          deserialized[key] = deserializedResult;
        }
      } else {
        const type = initiateTypeHandler(typeHandler);
        deserializeFrom = type.getDeserializeName() === null
          ? (type.getSerializeName() === null ? key : type.getSerializeName())
          : type.getDeserializeName();

        let [fail, normalizedValue] = type.parse(
          deserializeFrom,
          objValue ? objValue[deserializeFrom] : undefined
        );

        // Handle multilevel types normalization
        // for example conditions type
        while (isTypeObject(normalizedValue)) {
          const result = normalizedValue.parse(
            key,
            objValue ? objValue[key] : undefined
          );
          fail = result[0];
          normalizedValue = result[1];
        }

        if (config.doValidation) {
          const [errorDetails, valid] = type.validate(
            deserializeFrom,
            objValue ? objValue[deserializeFrom] : undefined,
            type.getOptions()
          );

          if (!valid) {
            fail = true;
            forEach(errorDetails, err => errorList.push(err));
          }
        }

        if (!fail || (fail && !type.isHideOnFail())) {
          if (!type.isHideOnDeserialization()) {
            deserialized[key] = normalizedValue;
          }
        }

        // default error message
        if (fail && errorList.length === 0) {
          errorList.push(
            `failed to deserialize from "${deserializeFrom}" to "${key}" with its type`
          );
        }

        if (errorList.length > 0) {
          errorResults[deserializeFrom] = Object.assign([], errorList);
        }
      }
    });

    return [errorResults, deserialized];
  };

  const isAllowUnknownProperties = this.options.allowUnknownProperties;

  if (!this.isArray) {
    const [errors, deserializedResult] = deserialize(
      valuesToDeserialize,
      this.schema,
      { doValidation: onValidation }
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
      const [errorDetails, deserializedResult] = deserialize(v, this.schema, {
        doValidation: onValidation
      });
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

module.exports = deserializeValue;
