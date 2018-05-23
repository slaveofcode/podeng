'use strict';

const { forEach, get } = require('lodash');
const { isArray, isObject, isFunction } = require('../../types/detector');
const PodengError = require('./PodengError');

const ERROR_VALIDATION_NAME = 'PodengValidationError';

const warningInspector = objErrorDetails => {
  forEach(objErrorDetails, (value, key) => {
    console.warn(`Podeng Warning: [${key}] ${value}`);
  });
};

const warningHandler = options => {
  return errorDetails => {
    if (options.giveWarning) {
      if (isArray(errorDetails)) {
        forEach(errorDetails, objErrorDetails =>
          warningInspector(objErrorDetails)
        );
      } else {
        warningInspector(errorDetails);
      }
    }
  };
};

const errorHandler = options => {
  return errorDetails => {
    /**
     * Default error throw
     */
    if (options.throwOnError === true) {
      throw new PodengError({
        name: ERROR_VALIDATION_NAME,
        message: `Validation fails ${JSON.stringify(errorDetails, null, 2)}`,
        details: JSON.stringify(errorDetails)
      });
    }

    /**
     * Handle custom error class
     */
    if (options.throwOnError instanceof Error) {
      throw new options.throwOnError() // eslint-disable-line
    }

    /**
     * exec custom func error
     */
    if (isObject(options.onError)) {
      const onKeyFunction = get(options.onError, 'onKey');
      const onAllFunction = get(options.onError, 'onAll');

      if (isFunction(onKeyFunction)) {
        forEach(errorDetails, (err, key) => {
          onKeyFunction.call(null, key, err) // eslint-disable-line
        });
      }

      if (isFunction(onAllFunction)) {
        onAllFunction.call(null, errorDetails) // eslint-disable-line
      }
    }
  };
};

const errorInitializer = (options = { throwOnError: false, onError: {} }) =>
  errorHandler(options);
const warningInitializer = (options = { giveWarning: false }) =>
  warningHandler(options);

module.exports = {
  errorInitializer,
  warningInitializer,
  ERROR_VALIDATION_NAME
};
