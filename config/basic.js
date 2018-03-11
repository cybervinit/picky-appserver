var errHandler = function (err, obj) {
	if (err) { throw err; }
}
var routeCheck = function(res, endpoint) {
	res.end("Reached: " + endpoint);
};

module.exports.errHandler = errHandler;
module.exports.routeCheck = routeCheck;

