'use strict'

const { includes, keys, difference } = require('lodash')
const { cls: blueprintClass } = require('../blueprint/instance')
const { combineDefaultOptions, makeError } = require('./utils')
const { isFunction } = require('../types/detector')

const ERROR_INVALID_COMPONENT =
  'You must supply blueprint object to create validate'
const ERROR_NO_VALUE_GIVEN = 'No value was given on validate'
const showErrorUnknownProperties = unknownProps =>
  `Unknown parameters for ${unknownProps.join(',')}`

const validatorCreator = (component, options = {}) => {
  const hasInstanceMethod = includes(keys(component), 'getInstance')

  if (!hasInstanceMethod) throw new TypeError(ERROR_INVALID_COMPONENT)

  if (hasInstanceMethod) {
    if (!(component.getInstance() instanceof blueprintClass)) {
      throw new TypeError(ERROR_INVALID_COMPONENT)
    }
  }

  const options = combineDefaultOptions(options)

  const Validator = function (comp, options) {
    this.component = comp
    this.validate = validate
    this.options = options
  }

  const validate = function (params) {
    if (!params) throw new TypeError(ERROR_NO_VALUE_GIVEN)
    const [
      err,
      errorDetails,
      normalizedValues
    ] = this.component.getInstance().normalize(params)

    const unknownParams = difference(
      keys(params),
      keys(this.component.getSchema())
    )
    if (unknownParams.length > 0 && !this.options.allowUnknownProperties) {
      throw new TypeError(showErrorUnknownProperties(unknownParams))
    }

    const ValidationError = makeError('ValidationError')

    if (err && options.customThrowMessage) {
      if (isFunction(options.customThrowMessage)) {
        return options.customThrowMessage.apply(errorDetails)
      } else if (options.customThrowMessage instanceof Error) {
        throw options.customThrowMessage
      }
    }
    if (err) {
      throw new ValidationError('Error validation', { details: errorDetails })
    }
  }

  const objValidator = new Validator(component, options)

  return objValidator
}
const checker = () => {}

module.exports = {
  validate: validatorCreator,
  check: checker
}
