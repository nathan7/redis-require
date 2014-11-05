'use strict'; //jshint node:true, evil:true
var fs = require('fs')
  , Path = require('path')
  , resolve = require('resolve')
  , EXTENSION = '.redis.lua'

module.exports = function(__dirname) {
  return function redisRequire(path) {
    var filename = resolve.sync(path, { basedir: __dirname, extensions: [EXTENSION] })
      , code = fs.readFileSync(filename, 'utf-8')
      , commentMatch = code.match(/^-- EVAL (\S+) (\d+)((?: \S+)*)$/m)

    if (!commentMatch)
      throw new SyntaxError('Expected argument description comment')

    var name_ = commentMatch[1].replace(/[^A-Za-z_]/g, '_')
      , keyCount = commentMatch[2] | 0
      , args = commentMatch[3].trim().split(' ')

    if (args.length < keyCount)
      throw new TypeError('More key parameters than total parameters')

    args.push('cb')

    var fn = new Function('__code__', 'return function ' + name_ + '(' + args.join(', ') + ') { return this.eval(' + ['__code__', keyCount].concat(args).join(', ') + ') }')(code)
    fn.install = function(name, client) {
      if (arguments.length === 1) {
        client = name
        name = name_
      }
      client[name] = fn
    }
    return fn
  }
}
