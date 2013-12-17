/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	flatterTree = require('flatterTree');
    Schema = mongoose.Schema;


/**
 * Object Schema
 */
var NodeSchema = new Schema({});
NodeSchema.plugin(flatterTree);
mongoose.model('Node', NodeSchema);