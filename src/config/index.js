const envConfig = require("./env/development");

module.exports = {
  mongoURI: envConfig.mongoURI,
  awsIotConfig: envConfig.awsIot,
  jwtSecret: envConfig.jwtSecret,
};
