const path = require("path");
const JWT_SECRET = "test_secret_123";
const MONGO_URI = process.env.MONGO_URI;
const AWS_HOST = process.env.AWS_HOST;

module.exports = {
  mongoURI: `${MONGO_URI}-test`,
  awsIot: {
    host: AWS_HOST,
    port: 8883,
    clientId: "inditronics-test-client",
    certPath: path.resolve(__dirname, "../certs/test.cert.pem.crt"),
    keyPath: path.resolve(__dirname, "../certs/test.private.pem.key"),
    caPath: path.resolve(__dirname, "../certs/root-ca.crt"),
  },
  jwtSecret: JWT_SECRET,
};
