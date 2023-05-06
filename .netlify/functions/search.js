const axios = require('axios');
exports.handler = async (event, context) => {
try {
const base = 'https://cors-anywhere.herokuapp.com/';
const url = event.queryStringParameters.url;
  if(url){
  const all = base + url;
  const response = await axios.get(all);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'text/plain',
      },
      body: response,
    };
  }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: error.message,
    };
  }
};
