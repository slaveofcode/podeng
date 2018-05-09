'use strict'

const { cls } = require('./instance')
const types = require('../types')
const { combineObjDefaultOptions } = require('./utils')
const { errorInitializer, warningInitializer } = require('./errors')

const createHandler = (schema, isArrayType = false) => {
  const initHandler = () => {
    const obj = new cls(schema, { isArrayType })

    const doProcessValue = values => {
      // Check values is an blueprint object
      // if yes, do execute the object and return the value from that object result
      // if not, just do normalize as usual
      console.log('Evaluating input values')
      console.log('Object process calling: ')
      return obj.normalizeValue(values)
    }

    // default process
    const handlerFunc = values => doProcessValue(values)

    handlerFunc.getInstance = () => obj
    handlerFunc.getClass = () => cls

    return handlerFunc
  }

  return initHandler()
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
      const [err, errDetails, normalizedValues] = handler(values)

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
