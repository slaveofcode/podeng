'use strict'

const { isArray } = require('../types/detector')
const { forEach } = require('lodash')

const warningInspector = objErrorDetails => {
  // repeats the object get individual key errors and show via console.warning
}

const warningHandler = options => {
  return errorDetails => {
    if (isArray(errorDetails)) {
      forEach(errorDetails, objErrorDetails =>
        warningInspector(objErrorDetails)
      )
    } else {
      warningInspector(objErrorDetails)
    }
  }
}

const errorInspector = objErrorDetails => {
  // repeats the object get individual key errors and throw if exist
}

const errorHandler = options => {
  return errorDetails => {
    if (isArray(errorDetails)) {
      forEach(errorDetails, objErrorDetails =>
        errorInspector(objErrorDetails, options)
      )
    } else {
      errorInspector(objErrorDetails)
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
