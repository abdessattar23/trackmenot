const corsAnywhere = require('cors-anywhere');
const server = corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
});

exports.search = server.listen(process.env.PORT || 3000, () => {
  console.log(`Running CORS Anywhere on ${exports.handler.url}`);
});
