/**
 * Aligator
 */

function isJSON(body){
  if (!body || 'string' == typeof body || 'function' == typeof body.pipe || Buffer.isBuffer(body)) {
    return false;
  }
  return true;
}

module.exports = function (opts){
  var opts = opts || {},
    param = opts.param,
    pretty = null == opts.pretty ? true : opts.pretty;

  return function *(next){
    yield *next;

    var body = this.body,

    /* Unsupported body type */
      stream = body
        && typeof body.pipe === 'function'
        && body._readableState
        && body._readableState.objectMode,
      json = isJSON(body);

    if (!json && !stream) {
      return;
    }

    /* Query */
    var hasParam = param && this.query.hasOwnProperty(param),
      prettify = pretty || hasParam;

    /* Object streams ? */
    if (stream) {
      /* Do nothing at the moment... */
      return;
    }

    /* Fix JSON responses */
    if (json && prettify) {
      return this.body = {meta: {}, data: body};
    }
  }
};
