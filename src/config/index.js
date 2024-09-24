const awsIotConfig = {
  keyPath: "./certs/test.private.pem.key",
  certPath: "./certs/test.cert.pem.crt",
  caPath: "./certs/root-CA.crt",
  clientId: "mqtt-client-" + Math.floor(Math.random() * 100000 + 1),
  host: "a3uoz4wfsx2nz3-ats.iot.ap-south-1.amazonaws.com",
};

module.exports = {
  awsIotConfig,
};
