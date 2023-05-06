const axios = require('axios');

exports.handler = async function(event, context) {
  const { url } = event.queryStringParameters;
  if (!url) return { statusCode: 400, body: 'Please provide a URL' };
  try {
    const response = await axios.get(url);
    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
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
