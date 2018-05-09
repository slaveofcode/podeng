'use strict'

const { cls } = require('./instance')
const types = require('../types')
const { combineObjDefaultOptions } = require('./utils')
const { errorInitializer, warningInitializer } = require('./errors')

const createHandler = (schema, isArrayType = false) => {
  const obj = new cls(schema, { isArrayType })

  const handlerFunc = () => {}
  handlerFunc.getInstance = () => obj
  handlerFunc.getClass = () => cls

  return handlerFunc
}

const componentCreator = isArrayComponent => {
  return (params, options = {}) => {
    const handler = createHandler(params, isArrayComponent)

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
        errDetails,
        normalizedValues
      ] = handler.getInstance().normalizeValue(values)

      if (err) {
        warningHandler(errDetails)
        errorHandler(errorDetails)
      }

      return normalizedValues
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

      return serializedValues
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

      return deserializedValues
    }

    /**
     * Getting instance from original class instance
     * @returns Object
     */
    component.getInstance = () => handler.getInstance()

    return component
  }
}

module.exports = {
  object: componentCreator(false),
  array: componentCreator(true),
  types
}
