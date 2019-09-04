'use strict';

const { includes, forEach } = require('lodash');
const {
  resolveEmbededObj,
  parseEmbedValue,
  initiateTypeHandler,
  handleUnknownProperties
} = require('./utils');

const serializeValue = function (
  valuesToSerialize,
  onValidation = false,
  opts = { isSelfCall: false }
) {
  let serialized = this.isArray ? [] : {};

  let isError = false;
  let errorDetails = [];
  let normalizedValues = {};
  if (!opts.isSelfCall) {
    [isError, errorDetails, normalizedValues] = this.normalize(
      valuesToSerialize,
      { doValidation: onValidation }
    );
  } else {
    normalizedValues = valuesToSerialize;
  }

  const isAllowUnknownProperties = this.options.allowUnknownProperties;

  const serialize = (normalizedValues, schema) => {
    const serialized = {};
    const normalizedKeys = Object.keys(normalizedValues);

    forEach(schema, (typeHandler, key) => {
      const embedObj = resolveEmbededObj(typeHandler);
      if (embedObj !== null) {
        if (!embedObj.isHideOnSerialization()) {
          const serializedResult = parseEmbedValue(
            'serialize',
            embedObj,
            normalizedValues[key]
          );
          const serializeTo = embedObj.getSerializeName();
          if (serializeTo !== null) {
            serialized[serializeTo] = serializedResult;
          } else {
            serialized[key] = serializedResult;
          }
        }
      } else {
        const type = initiateTypeHandler(typeHandler);
        if (includes(normalizedKeys, key) && !type.isHideOnSerialization()) {
          const serializeTo = type.getSerializeName();
          if (serializeTo !== null) {
            serialized[serializeTo] = normalizedValues[key];
          } else {
            serialized[key] = normalizedValues[key];
          }
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

module.exports = serializeValue;
