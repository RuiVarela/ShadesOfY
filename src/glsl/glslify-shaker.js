const string = require('glsl-token-string')
const tokenize = require('glsl-tokenizer')
const uncommenter = require("glsl-strip-comments");
const shake = require('glsl-token-function-shaker')

module.exports = transform
module.exports.sync = transform;

function transform(file, src, opts, done) {
  let tokens = tokenize(src);
 
  shake(tokens, { ignore: ['render'] });
  
  let text = string(tokens);
  text = uncommenter(text);

  return typeof done === 'function' ? done(null, text) : text;
}

