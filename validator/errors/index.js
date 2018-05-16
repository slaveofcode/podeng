'use strict'

const { forEach } = require('lodash')
const { isArray } = require('../../types/detector')
const PodengError = require('./PodengError')

const warningInspector = objErrorDetails => {
  forEach(objErrorDetails, (value, key) => {
    console.warn(`${key}: ${value}`)
  })
}

const warningHandler = options => {
  return errorDetails => {
    if (options.giveWarning) {
      if (isArray(errorDetails)) {
        forEach(errorDetails, objErrorDetails =>
          warningInspector(objErrorDetails)
        )
      } else {
        warningInspector(errorDetails)
      }
    }
  }
}

const errorHandler = options => {
  return errorDetails => {
    if (options.throwOnError) {
      throw new PodengError({
        name: 'PodengValidationError',
        message: `Validation fails ${JSON.stringify(errorDetails, null, 2)}`,
        details: JSON.stringify(errorDetails)
      })
    }
  }
}

const errorInitializer = (options = { throwOnError: false }) =>
  errorHandler(options)
const warningInitializer = (options = { giveWarning: false }) =>
  warningHandler(options)

module.exports = {
  errorInitializer,
  warningInitializer
}
