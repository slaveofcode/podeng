'use strict'

const { includes, keys } = require('lodash')
const { cls } = require('./instance')
const types = require('../types')
const { combineObjDefaultOptions } = require('./utils')
const { errorInitializer, warningInitializer } = require('./errors')
const { isFunction } = require('../types/detector')

/**
 * Creating new instance and return as handler function
 * @param {Object} schema
 * @param {boolean} isArrayType
 */
const createHandler = (schema, isArrayType = false) => {
  const inst = new cls(schema, { isArray: isArrayType })

  const handlerFunc = () => {}
  handlerFunc.getInstance = () => inst
  handlerFunc.getClass = () => cls

  return handlerFunc
}

/**
 * Deep freezing object recursively
 * @param {Object} obj
 */
const freezeObject = obj => {
  keys(obj).forEach(name => {
    const prop = obj[name]
    if (typeof prop === 'object' && prop !== null) freezeObject(prop)
  })

  return Object.freeze(obj)
}

const componentCreator = isArrayComponent => {
  return (params, options = {}) => {
    /**
     * Detect params passed as a component instead of a json
     */
    let handler
    if (includes(keys(params), 'getHandler') && isFunction(params.getHandler)) {
      // Re-creating handler from existing components also copying the options
      handler = createHandler(params.getParams(), isArrayComponent)
      options = params.getOptions()
    } else {
      handler = createHandler(params, isArrayComponent)
    }

    options = combineObjDefaultOptions(options)

    const errorHandler = errorInitializer({
      throwOnError: options.throwOnError
    })
    const warningHandler = warningInitializer({
      giveWarning: options.giveWarning
    })

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
      ] = handler.getInstance().normalize(values)

      if (err) {
        warningHandler(errorDetails)
        errorHandler(errorDetails)
      }

      return options.frozen ? freezeObject(normalizedValues) : normalizedValues
    }

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
      ] = handler.getInstance().serialize(values)
      if (err) {
        warningHandler(errDetails)
        errorHandler(errorDetails)
      }

      return options.frozen ? freezeObject(serializedValues) : serializedValues
    }

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
      ] = handler.getInstance().deserialize(values)

      if (err) {
        warningHandler(errDetails)
        errorHandler(errorDetails)
      }

      return options.frozen
        ? freezeObject(deserializedValues)
        : deserializedValues
    }

    /**
     * Return handler from this component
     * @returns Object
     */
    component.getHandler = () => handler

    /**
     * Return instance from original class instance
     * @returns Object
     */
    component.getInstance = () => handler.getInstance()

    component.getParams = () => Object.assign({}, params)
    component.getOptions = () => Object.assign({}, options)

    return component
  }
}

module.exports = {
  object: componentCreator(false),
  array: componentCreator(true),
  types
}
