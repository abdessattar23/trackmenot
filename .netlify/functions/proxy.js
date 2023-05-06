const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;
  if (!url) return { statusCode: 401, body: 'Please provide a URL' };
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];

    $('div.links_main').each((i, element) => {
      const $element = $(element);
      const title = $element.find('h2.result__title a').text();
      const iconLink = 'https:' + $element.find('span.result__icon a').attr('href');
      const snippet = $element.find('a.result__snippet').text();
      const linkElement = $element.find('h2.result__title a');
      const link = linkElement.attr('href').match(/https:\/\/[^&]+/)[0];

      results.push({ title, iconLink, snippet, link });
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(results),
      headers: {
        'Access-Control-Allow-Origin': '.netlify.app',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify(error.response.data),
      headers: {
        'Access-Control-Allow-Origin': '.netlify.app',
        'Content-Type': 'application/json',
      },
    };
  }
};
