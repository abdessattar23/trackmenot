const axios = require('axios');
const cheerio = require('cheerio');
const detectBrowser = require('detect-browser');

exports.handler = async function(event, context) {
  const q = event.queryStringParameters.q;
  if (!q) return { statusCode: 401, body: 'Please provide a query' };
  try {
    const url = 'https://html.duckduckgo.com/html/?q=' + q;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];

    const userAgent = event.headers['user-agent'];
    const browser = detectBrowser.detect(userAgent);

    if (browser) {
      // Request is coming from a browser
      //return { statusCode: 403, body: 'Direct access not allowed' };
    }

    $('div.links_main').each((i, element) => {
      const $element = $(element);
      const title = $element.find('h2.result__title a').text();
      const iconLink = 'https:' + $element.find('span.result__icon img').attr('src');
      const snippet = $element.find('a.result__snippet').text();
      const linkElement = $element.find('h2.result__title a');
      const link = decodeURIComponent(linkElement.attr('href').match(/https[^&]+/)[0]);

      results.push({ title, iconLink, snippet, link });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(results),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(error.response?.data || { error: 'Internal Server Error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  }
};
