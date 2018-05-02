const winston = require('winston') // Logger

var errHandler = function (err, obj) {
  if (err) { throw err }
}

var errWrap = (fn) => (...args) => fn(...args).catch(args[2])

var routeCheck = function (res, endpoint) {
  res.end('Reached: ' + endpoint)
}

const end = (res, obj) => {
  return res.end(JSON.stringify(obj))
}

const reqLog = (req) => {
  if (req.headers) winston.info(req.headers)
  if (req.body) winston.info(req.body)
  if (req.params) winston.info(req.params)
  if (req.query) winston.info(req.query)
}

module.exports.errHandler = errHandler
module.exports.errWrap = errWrap
module.exports.routeCheck = routeCheck
module.exports.end = end
module.exports.reqLog = reqLog
