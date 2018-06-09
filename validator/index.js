'use strict';

const { keys, difference } = require('lodash');
const { cls: blueprintClass } = require('../blueprint/instance');
const { combineDefaultOptions, isBlueprintObject } = require('./utils');
const { isFunction } = require('../types/detector');
const PodengError = require('./errors/PodengError');
const { errorInitializer, ERROR_VALIDATION_NAME } = require('./errors');

const ERROR_INVALID_COMPONENT =
  'You must supply blueprint object to create validate';
const ERROR_NO_VALUE_GIVEN = 'No value was given on validate';
const showErrorUnknownProperties = unknownProps =>
  `Unknown parameters for ${unknownProps.join(',')}`;

const validatorCreator = (component, options = {}) => {
  const isValidObject = isBlueprintObject(component);

  if (!isValidObject) throw new TypeError(ERROR_INVALID_COMPONENT);

  if (isValidObject) {
    if (!(component.getInstance() instanceof blueprintClass)) {
      throw new TypeError(ERROR_INVALID_COMPONENT);
    }
  }

  options = combineDefaultOptions(options);

  const Validator = function (comp, options) {
    this.component = comp;
    this.validate = validate;
    this.check = check;
    this.options = options;
  };

  const handleUnknownParams = (schema, params, throwing = true) => {
    let errorUnknownParams = null;
    console.log(schema);
    const unknownParams = difference(keys(params), keys(schema));
    if (unknownParams.length > 0) {
      if (throwing) {
        throw new PodengError({
          name: ERROR_VALIDATION_NAME,
          message: showErrorUnknownProperties(unknownParams),
          details: unknownParams
        });
      }

      errorUnknownParams = `Unkown parameter(s) detected: ${unknownParams.join(
        ', '
      )}`;
    }

    return errorUnknownParams;
  };

  const handleCustomThrows = (errorDetails, isCustomThrowMessage = false) => {
    if (isFunction(isCustomThrowMessage)) {
      return isCustomThrowMessage.apply(errorDetails);
    } else if (isCustomThrowMessage instanceof Error) {
      throw isCustomThrowMessage;
    }
  };

  const validate = function (params) {
    if (!params) throw new TypeError(ERROR_NO_VALUE_GIVEN);

    const [err, errorDetails] = !this.options.deserialization
      ? this.component.getInstance().normalize(params)
      : this.component.getInstance().deserialize(params);

    if (err && !this.options.allowUnknownProperties) {
      handleUnknownParams(this.component.getSchema(), params);
    }

    if (err && this.options.customThrowMessage) {
      handleCustomThrows(errorDetails, this.options.customThrowMessage);
    }

    if (err) {
      const errorHandler = errorInitializer({ throwOnError: true });
      errorHandler(errorDetails);
    }
  };

  const check = function (params) {
    if (!params) throw new TypeError(ERROR_NO_VALUE_GIVEN);

    const [err, errorDetails] = !this.options.deserialization
      ? this.component.getInstance().normalize(params)
      : this.component.getInstance().deserialize(params);

    if (err && !this.options.allowUnknownProperties) {
      const errorUnknown = handleUnknownParams(
        this.component.getSchema(),
        params,
        false
      );
      if (errorUnknown) {
        errorDetails.unknown_params = errorUnknown;
      }
    }

    return [err, errorDetails];
  };

  const objValidator = new Validator(component, options);

  return objValidator;
};

module.exports = validatorCreator;
