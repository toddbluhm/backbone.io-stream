// Throw an error when a URL is needed, and none is supplied.
module.exports.UrlError = function() {
  throw new Error('A "url" property or function must be specified');
};
