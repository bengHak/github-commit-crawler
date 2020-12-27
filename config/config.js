require('dotenv').config();

let CONFIG = {}

CONFIG.slack_api_token = process.env.SLACK_API_TOKEN;
CONFIG.port = process.env.PORT || '3000';


module.exports = CONFIG;