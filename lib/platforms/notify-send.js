/*
 * grunt-notify
 * https://github.com/dylang/grunt-notify
 *
 * Copyright (c) 2013 Dylan Greene
 * Licensed under the MIT license.
 */
'use strict';

var NOTIFY_TYPE = 'notify-send';

var path = require('path');
var spawn = require('../util/spawn');
var findApp = require('../util/findApp');
var guessProjectName = require('../util/guessProjectName');
var DEFAULT_IMAGE = path.resolve(__dirname + '../../../images/grunt-logo.png');
var DEFAULT_DURATION = 3000;
var CMD = 'notify-send';

function supported(options) {

  var app = findApp(CMD);

  options.debug({
    'notify-send': app || 'notify-send was not found in your path'
  });

  return !!findApp(CMD);
}

// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_addslashes/
function addslashes(str) {
  return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

// single quotes breaks things: unexpected EOF while looking for matching `''
function replaceSingleQuotes(str) {
  return str.replace(/'/g, '"'); // single quotes break things
}

function notify(options, cb) {

  var args = [
    //'--hint=int:transient:1',
    //'--icon=' + DEFAULT_IMAGE,
    //'--expire-time=' + (options.duration * 1000 || DEFAULT_DURATION),
    replaceSingleQuotes(addslashes(options.title || guessProjectName())),
    replaceSingleQuotes(addslashes(options.message))
  ];

  options.debug({
    cmd: CMD,
    args: args.join(' ')
  });

  spawn(CMD, args, function(code) {
    if (code !== 0) {
      cb(code);
    } else {
      cb();
    }
  });
}

module.exports = {
  name: NOTIFY_TYPE,
  notify: notify,
  supported: supported
};
