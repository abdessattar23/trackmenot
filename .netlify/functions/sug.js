const axios = require('axios');
const cheerio = require('cheerio');


exports.handler = async function(event, context) {
  const q = event.queryStringParameters.q;
  if (!q) return { statusCode: 200, body: '' };
  try {
    const da = await axios.get("https://api.ipdata.co/?api-key=039310658d62e9a1260c7f070e0e76dc396f0d25b317fcd4bf3d7b18");
    const country = da.country_code;
    const url = 'https://www.bing.com/AS/Suggestions?mkt=en-'+country+'&cvid=14EAFA164E84424DA4470C1658041F7A&qry=' + q;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];
    $('li').each((i, element) => {
      const $element = $(element);
      const title = $element.find('span.sa_tm_text').text();
      if(title){
        results.push({title});
      }else{
        const title2 = $element.find('div.pp_title').text();
        results.push({title2})
      }
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
      body: JSON.stringify(error.response?.data || { error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  }
};
