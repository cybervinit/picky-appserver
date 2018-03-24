var errHandler = function (err, obj) {
	if (err) { throw err; }
}

var errWrap = (fn) => (...args) => fn(...args).catch(args[2]);

var routeCheck = function(res, endpoint) {
	res.end("Reached: " + endpoint);
};

module.exports.errHandler = errHandler;
module.exports.errWrap = errWrap;
module.exports.routeCheck = routeCheck;

