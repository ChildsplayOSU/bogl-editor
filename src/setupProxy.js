//
// setupProxy.js
//
// This enables proxy-like behavior from React to forward requests
// server-side to our local spielserver instance running on the same machine.
// By keeping the requests local, we can avoid hitting anything that we don't want to
//

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {

  // test endpoint, verifies spielserver is running
  app.use(
    '/api_1/test',
    createProxyMiddleware({
      target: 'http://localhost:5174/test',
      changeOrigin: true,
      ignorePath: true
    })
  );

  // attempts to run this code under the local instance
  app.use(
    '/api_1/runCode',
    createProxyMiddleware({
      target: 'http://localhost:5174/runCode',
      changeOrigin: true,
      ignorePath: true
    })
  );
};
