var db = require('../config');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var urlsSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
  timestamp: {type: Date, default: Date.now},
});

urlsSchema.pre('save', function(next) {
  if (!this.code) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
  }
  next();
});

var Link = mongoose.model('Link', urlsSchema)

module.exports = Link;