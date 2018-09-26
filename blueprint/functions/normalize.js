'use strict';

const { keys, forEach } = require('lodash');
const { isArray } = require('../../types/detector');
const { isTypeObject } = require('../utils');
const { resolveEmbededObj, parseEmbedValue, initiateTypeHandler, handleUnknownProperties } = require('./utils');

const normalizeValue = function (valuesToNormalize, onValidation = false) {
  if (this.isArray && !isArray(valuesToNormalize)) {
    throw new TypeError('Wrong value type, you must supply array values!');
  }

  const normalize = (objValue, schema, config = { doValidation: false }) => {
    const normalized = {};
    const errorResults = {};

    forEach(schema, (typeHandler, key) => {
      // checking handler is an embedded class
      // so we do recursive operation
      const embedObj = resolveEmbededObj(typeHandler);
      if (embedObj !== null) {
        const embedValue = objValue[key];

        const result = parseEmbedValue('normalize', embedObj, embedValue);

        if (result !== null) normalized[key] = result;
      } else {
        const errorList = [];

        const type = initiateTypeHandler(typeHandler);

        let [fail, normalizedValue] = type.parse(
          key,
          objValue ? objValue[key] : undefined,
          {
            operationType: 'serialize',
            data: objValue || {}
          }
        );

        // Handle multilevel types normalization
        // for example conditions type
        while (isTypeObject(normalizedValue)) {
          const result = normalizedValue.parse(
            key,
            objValue ? objValue[key] : undefined,
            {
              operationType: 'serialize',
              data: objValue || {}
            }
          );
          fail = result[0];
          normalizedValue = result[1];
        }

        // only execute if for validation purpose
        if (config.doValidation) {
          const [errorDetails, valid] = type.validate(
            key,
            objValue ? objValue[key] : undefined,
            type.getOptions()
          );

          if (!valid) {
            fail = true;
            forEach(errorDetails, err => errorList.push(err));
          }
        }

        if (!fail || (fail && !type.isHideOnFail())) {
          normalized[key] = normalizedValue;
        }

        // default error message
        if (fail && errorList.length === 0) {
          errorList.push(`failed to parse "${key}" with its type`);
        }

        if (errorList.length > 0) {
          errorResults[key] = Object.assign([], errorList);
        }
      }
    });

    return [errorResults, normalized];
  };

  const isAllowUnknownProperties = this.options.allowUnknownProperties;

  if (!this.isArray) {
    const [errors, normalizedResult] = normalize(
      valuesToNormalize,
      this.schema,
      { doValidation: onValidation }
    );

    if (isAllowUnknownProperties) {
      Object.assign(
        normalizedResult,
        handleUnknownProperties(valuesToNormalize, this.schema)
      );
    }

    return [keys(errors).length > 0, errors, normalizedResult];
  } else {
    const results = valuesToNormalize.map(v => {
      const [errorDetails, normalizedResult] = normalize(v, this.schema, {
        doValidation: onValidation
      });
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

module.exports = normalizeValue;
