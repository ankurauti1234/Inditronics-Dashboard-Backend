// Import the MQTT configuration
const mqtt = require("./config/mqtt");

// No need to import or use mqttMiddleware anymore

// The MQTT message handling is now done directly in the config/mqtt.js file,
// so we don't need to set up the message event listener here.

// If you need to do any additional setup or use the MQTT client elsewhere in your app,
// you can still access it through the 'mqtt' variable.

// Rest of your application code...
