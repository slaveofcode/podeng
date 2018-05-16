'use strict'

const PodengError = function (options) {
  options = options || {}

  this.name = options.name || 'PodengError'
  this.message = options.message
  this.cause = options.cause

  this._err = new Error()
  this.chain = this.cause ? [this].concat(this.cause.chain) : [this]
}

PodengError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: PodengError,
    writable: true,
    configurable: true
  }
})

Object.defineProperty(PodengError, 'stack', {
  get: function stack () {
    return (
      this.name +
      ': ' +
      this.message +
      '\n' +
      this._err.stack.split('\n').slice(2).join('\n')
    )
  }
})

Object.defineProperty(PodengError.prototype, 'why', {
  get: function why () {
    let _why = this.name + ': ' + this.message
    for (var i = 1; i < this.chain.length; i++) {
      var e = this.chain[i]
      _why += ' <- ' + e.name + ': ' + e.message
    }
    return _why
  }
})

/**
 * How to Use
 */
// function fail() {
//     throw new PodengError({
//         name: 'BAR',
//         message: 'I messed up.'
//     });
// }

// function failFurther() {
//     try {
//         fail();
//     } catch (err) {
//         throw new PodengError({
//             name: 'FOO',
//             message: 'Something went wrong.',
//             cause: err
//         });
//     }
// }

// try {
//     failFurther();
// } catch (err) {
//     console.error(err.why);
//     console.error(err.stack);
//     console.error(err.cause.stack);
// }

module.exports = {
  PodengError
}
