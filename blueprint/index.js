'use strict';

const { includes, keys, forEach } = require('lodash');
const {
  cls: BlueprintClass,
  embedCls: BlueprintEmbedClass
} = require('./instance');
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
 * @param {Object} options
 * @param {boolean} isArrayType
 */
const createHandler = (schema, options, isArrayType = false) => {
  const inst = new BlueprintClass(schema, options, { isArray: isArrayType });

  const handlerFunc = () => { };
  handlerFunc.getInstance = () => inst;
  handlerFunc.getClass = () => BlueprintClass;

  return handlerFunc;
};

/**
 * Deep freezing object recursively
 * @param {Object} obj
 */
const freezeObject = obj => {
  forEach(keys(obj), name => {
    const prop = obj[name];
    if (typeof prop === 'object' && prop !== null) freezeObject(prop);
  });

  return Object.freeze(obj);
};

const componentCreator = isArrayComponent => {
  return (params, options = {}) => {
    let combinedDefaultOptions = combineObjDefaultOptions(options);

    /**
     * Detect params passed as a component instead of a json
     */
    let handler;
    if (
      includes(keys(params), 'getHandler') &&
      isFunction(params.getHandler) &&
      includes(keys(params), 'getInstance') &&
      isFunction(params.getInstance)
    ) {
      if (!(params.getInstance() instanceof BlueprintClass)) {
        throw new TypeError(
          'Invalid parameter, not an instance of blueprint object'
        );
      }
      // Re-creating handler from existing components
      // overriding the default options

      combinedDefaultOptions = isArrayComponent
        ? Object.assign(combinedDefaultOptions, params.getOptions(), options)
        : combinedDefaultOptions;

      handler = createHandler(
        params.getParams(),
        combinedDefaultOptions,
        isArrayComponent
      );
    } else {
      handler = createHandler(params, combinedDefaultOptions, isArrayComponent);
    }

    const { onError, throwOnError, giveWarning } = combinedDefaultOptions;
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

      return combinedDefaultOptions.frozen
        ? freezeObject(normalizedValues)
        : normalizedValues;
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

      return combinedDefaultOptions.frozen
        ? freezeObject(serializedValues)
        : serializedValues;
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

      return combinedDefaultOptions.frozen
        ? freezeObject(deserializedValues)
        : deserializedValues;
    };

    component.embed = options =>
      new BlueprintEmbedClass(handler.getInstance(), options);

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
    component.getOptions = () => Object.assign({}, combinedDefaultOptions);

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
      'To extend you need to pass blueprint object not an array!'
    );
  }

  const hasInstanceFunc = includes(keys(component), 'getInstance');

  if (!hasInstanceFunc) {
    throw new TypeError('To extend you must pass blueprint object!');
  }

  if (!(component.getInstance() instanceof BlueprintClass)) {
    throw new TypeError('To extend you must pass blueprint object!');
  }

  const extOptions = combineExtDefaultOptions(extendOptions);

  const originalParams = component.getParams();
  const originalOptions = component.getOptions();

  options = combineObjDefaultOptions(Object.assign({}, originalOptions, options));

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

  return componentCreator(component.getInstance().isArray)(finalParams, options);
};

module.exports = {
  object: componentCreator(false),
  array: componentCreator(true),
  extend: extensibleComponent,
  types,
  BlueprintClass,
  BlueprintEmbedClass
};
