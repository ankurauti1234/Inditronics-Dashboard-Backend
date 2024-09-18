const path = require("path");
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const AWS_HOST = process.env.AWS_HOST;

module.exports = {
  mongoURI: `${MONGO_URI}`,
  awsIot: {
    host: AWS_HOST,
    port: 8883,
    protocol: "mqtts",
    clientId: "inditronics-prod-client",
    certPath: path.resolve(__dirname, "../certs/test.cert.pem.crt"),
    keyPath: path.resolve(__dirname, "../certs/test.private.pem.key"),
    caPath: path.resolve(__dirname, "../certs/root-ca.crt"),
  },
  jwtSecret: JWT_SECRET,
};
