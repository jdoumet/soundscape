'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    age: {
        type: Number,
        trim: true,
        default: '',
        min: 0,
        validate: [validateLocalStrategyProperty, 'Please select age']
    },
    gender: {
        type: String,
        trim: true,
        default: 'Male'
    },
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    question1: {
        type: String
    },
    question2: {
        type: String
    },
    question3: {
        type: String
    },
    question4: {
        type: String
    },
    question5: {
        type: String
    },
    question6: {
        type: String
    },
    answer0:[String],
    answer1:[String],
    answer2:[String],
    answer3:[String],
    answer4:[String],
    answer5:[String],
    answer6:[String],
    answer7:[String],
    answer8:[String],
    survey0: { type: String },
    survey1: { type: String },
    survey2: { type: String },
    survey3: { type: String },
    survey4: { type: String },
    survey5: { type: String },
    survey6: { type: String },
    survey7: { type: String },
    survey8: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
