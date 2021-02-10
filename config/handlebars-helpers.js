module.exports = {
  ifUser: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifSelf: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifNull: function (a, options) {
    if (a === null) {
      return options.fn(this)
    }
    return options.inverse(this)
  }
}
