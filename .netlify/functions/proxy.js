const axios = require('axios');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;
  if (!url) return { statusCode: 401, body: 'Please provide a URL' };
  try {
    const response = await axios.get(url);
    return {
      statusCode: response.status,
      body: response.data,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify(error.response.data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  }
};
