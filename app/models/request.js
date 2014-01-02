var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Object Schema
 */
var RequestSchema = new Schema({
    oauth: {
    	consumer_key: String,
    	consumer_secret: String,
    	token: String,
    	token_secret: String
    },
    url: String
});

mongoose.model('Request', RequestSchema);