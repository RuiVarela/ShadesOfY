const string = require('glsl-token-string')
const tokenize = require('glsl-tokenizer')
const resolve = require('glsl-resolve')
const shake = require('glsl-token-function-shaker')

module.exports = glslifyShaker
module.exports.sync = glslifyShaker;

function glslifyShaker(file, src, opts, done) {
  const tokens = tokenize(src)

  shake(tokens);
  const shaken = string(tokens);

  return typeof done === 'function' ? done(null, shaken) : string(shaken);
}

