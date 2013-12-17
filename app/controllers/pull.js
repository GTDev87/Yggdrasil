/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    request = require('request')
    Node = mongoose.model('Node'),
	url = require('url');;

/**
 * List of Articles
 */
exports.pullData = function(req, res) {
	console.log("req.body = %j", req.body);

	request.get(req.body, function(error, response, body){
		if (!error && response.statusCode == 200) {
			console.log("body = %j", body);
			var jsonResponse = JSON.parse(body);
			if(_.isArray(jsonResponse)){
				jsonResponse = _.extend({}, jsonResponse);
			}
			res.json(jsonResponse);
		}else{
			console.log("error = %j", error);
			//console.log("response.statusCode = %j", response.statusCode);
		}
	});
};

exports.saveData = function (req, res) {
	var name = req.body.name;
	var location = req.body.location || null;
	var data = req.body.data;

	console.log("saveData");
	// console.log("req.body = %j", req.body);
	// console.log("name = %j", name);
	// console.log("location = %j", location);
	// console.log("data = %j", data);

	Node.node().insert(name, location, data, {}, function () {
		res.json(false);
	});
}

exports.findData = function (req, res) {
	var query = url.parse(req.url, true).query;
	console.log("query = %j", query);
	var location = query.location || null;

	console.log("location = %j", location);
	Node.node().findFull(location, function (err, node) {
		res.json(node);
	});
}