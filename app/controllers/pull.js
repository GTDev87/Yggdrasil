/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    request = require('request');

/**
 * List of Articles
 */
exports.getData = function(req, res) {
	console.log("req.body = %j", req.body);

	request.get(req.body, function(error, response, body){
		if (!error && response.statusCode == 200) {
			console.log("body = %j", body);
			var jsonResponse = JSON.parse(body);
			res.json(jsonResponse);
		}else{
			console.log("error = %j", error);
			console.log("response.statusCode = %j", response.statusCode);
		}
	});
    
};
