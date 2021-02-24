const { createProxyMiddleware } = require('http-proxy-middleware');

const logLevel = process.env.REACT_APP_HPM_LOG_LEVEL || 'warn';

module.exports = (app) => {
  const restApiBaseUrl = '/api/rest';
  const socketApiBaseUrl = '/api/socket';

  const restApiProxyAddress =
    process.env.REACT_APP_REST_PROXY || 'http://localhost:3001';
  const socketApiProxyAddress =
    process.env.REACT_APP_SOCKET_PROXY || 'http://localhost:3002';

  registerApiProxy(app, restApiBaseUrl, restApiProxyAddress, false);
  registerApiProxy(app, socketApiBaseUrl, socketApiProxyAddress, true);
};

/**
 * `baseUrl/foo` gets proxied to `proxyAddress/foo`
 *
 * example:
 * ```txts
 * baseUrl: /bar/baz
 * proxyAddress: http://test.com
 *
 * /bar/baz/foo -> http://test.com/foo
 * ```
 */
function registerApiProxy(app, baseUrl, proxyAddress, handleSockets) {
  app.use(
    createProxyMiddleware(baseUrl, {
      target: proxyAddress,
      pathRewrite: { [`^${baseUrl}`]: '' },
      ws: handleSockets,
      logLevel,
    })
  );
}
