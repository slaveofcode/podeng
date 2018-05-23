'use strict';

const { includes, keys, forEach } = require('lodash');
const { cls: BlueprintClass } = require('./instance');
const types = require('../types');
const {
  combineObjDefaultOptions,
  combineExtDefaultOptions
} = require('./utils');
const { errorInitializer, warningInitializer } = require('../validator/errors');
const { isFunction, isArray } = require('../types/detector');

/**
 * Creating new instance and return as handler function
 * @param {Object} schema
 * @param {boolean} isArrayType
 */
const createHandler = (schema, isArrayType = false) => {
  const inst = new BlueprintClass(schema, { isArray: isArrayType });

  const handlerFunc = () => {};
  handlerFunc.getInstance = () => inst;
  handlerFunc.getClass = () => BlueprintClass;

  return handlerFunc;
};

/**
 * Deep freezing object recursively
 * @param {Object} obj
 */
const freezeObject = obj => {
  keys(obj).forEach(name => {
    const prop = obj[name];
    if (typeof prop === 'object' && prop !== null) freezeObject(prop);
  });

  return Object.freeze(obj);
};

const componentCreator = isArrayComponent => {
  return (params, options = {}) => {
    /**
     * Detect params passed as a component instead of a json
     */
    let handler;
    if (includes(keys(params), 'getHandler') && isFunction(params.getHandler)) {
      // Re-creating handler from existing components also copying the options
      handler = createHandler(params.getParams(), isArrayComponent);
      options = params.getOptions();
    } else {
      handler = createHandler(params, isArrayComponent);
    }

    options = combineObjDefaultOptions(options);

    const { onError, throwOnError, giveWarning } = options;
    const errorHandler = errorInitializer({
      onError,
      throwOnError
    });
    const warningHandler = warningInitializer({
      giveWarning
    });

    /**
     * Normalize function
     * @param {Object} values
     * @returns {Object} Normalized values
     */
    const component = function (values) {
      const [
        err,
        errorDetails,
        normalizedValues
      ] = handler.getInstance().normalize(values);

      if (err) {
        warningHandler(errorDetails);
        errorHandler(errorDetails);
      }

      return options.frozen ? freezeObject(normalizedValues) : normalizedValues;
    };

    /**
     * Serialize function
     * @param {Object} values
     * @returns {Object} Serialized values
     */
    component.serialize = values => {
      const [
        err,
        errorDetails,
        serializedValues
      ] = handler.getInstance().serialize(values);
      if (err) {
        warningHandler(errorDetails);
        errorHandler(errorDetails);
      }

      return options.frozen ? freezeObject(serializedValues) : serializedValues;
    };

    /**
     * Deserialize function
     * @param {Object} values
     * @returns {Object} Deserialized values
     */
    component.deserialize = values => {
      const [
        err,
        errorDetails,
        deserializedValues
      ] = handler.getInstance().deserialize(values);

      if (err) {
        warningHandler(errorDetails);
        errorHandler(errorDetails);
      }

      return options.frozen
        ? freezeObject(deserializedValues)
        : deserializedValues;
    };

    /**
     * Return handler from this component
     * @returns Object
     */
    component.getHandler = () => handler;

    /**
     * Return instance from original class instance
     * @returns Object
     */
    component.getInstance = () => handler.getInstance();

    /**
     * Get Schema from class instance
     * @returns Object
     */
    component.getSchema = () => handler.getInstance().schema;

    component.getParams = () => Object.assign({}, params);
    component.getOptions = () => Object.assign({}, options);

    return component;
  };
};

const extensibleComponent = (
  component,
  params,
  options = {},
  extendOptions = {}
) => {
  if (isArray(component)) {
    throw new TypeError(
      'To extend you need to pass blueprint object not array!'
    );
  }

  const hasInstanceFunc = includes(keys(component), 'getInstance');

  if (!hasInstanceFunc) {
    throw new TypeError('To extend you must pass blueprint object!');
  }
  if (!(component.getInstance() instanceof BlueprintClass)) {
    throw new TypeError('To extend you must pass blueprint object!');
  }

  options = combineObjDefaultOptions(options);
  const extOptions = combineExtDefaultOptions(extendOptions);

  const originalParams = component.getParams();
  const originalOptions = component.getOptions();

  const deleteProperties = (params, listPropsToDelete) => {
    forEach(listPropsToDelete, propName => {
      if (originalParams[propName]) {
        delete params[propName];
      }
    });
  };

  if (extOptions.deleteProperties.length > 0) {
    deleteProperties(originalParams, extOptions.deleteProperties);
  }

  const finalParams = Object.assign({}, originalParams, params);
  const finalOptions = Object.assign({}, originalOptions, options);

  return componentCreator(false)(finalParams, finalOptions);
};

module.exports = {
  object: componentCreator(false),
  array: componentCreator(true),
  extend: extensibleComponent,
  types
};
