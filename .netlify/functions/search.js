const cors_proxy = require('cors-anywhere');

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

const handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    cors_proxy.createServer({
      originWhitelist: [], // Allow all origins
      requireHeader: ['origin', 'x-requested-with'],
      removeHeaders: ['cookie', 'cookie2']
    }).addListener('request', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World!\n');
    }).listen(port, host, () => {
      console.log(`CORS Anywhere server running on ${host}:${port}`);
      resolve({
        statusCode: 200,
        body: 'CORS Anywhere server running on ${host}:${port}'
      });
    });
  });
};

module.exports = { handler };
