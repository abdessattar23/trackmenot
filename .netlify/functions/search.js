const cors_proxy = require('cors-anywhere');
const url = require('url');
const http = require('http');

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

const handler = async (event, context) => {
  const query = event.queryStringParameters;
  const targetUrl = query.url;

  return new Promise((resolve, reject) => {
    cors_proxy.createServer({
      originWhitelist: [], // Allow all origins
      requireHeader: ['origin', 'x-requested-with'],
      removeHeaders: ['cookie', 'cookie2']
    }).addListener('request', (req, res) => {
      const reqUrl = url.parse(req.url);
      const target = url.parse(targetUrl);

      const options = {
        hostname: target.hostname,
        port: target.port || 80,
        path: reqUrl.path,
        method: req.method,
        headers: req.headers
      };

      const proxyReq = http.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
          data += chunk;
        });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          res.end(data);
        });
      });

      req.pipe(proxyReq);
    }).listen(port, host, () => {
      console.log(`CORS Anywhere server running on ${host}:${port}`);
      resolve({
        statusCode: 200,
        body: `Proxying ${targetUrl} through CORS Anywhere server at ${host}:${port}`
      });
    });
  });
};

module.exports = { handler };
