// Importing required modules
const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/realtimeDB';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define schema for the device data
const DeviceSchema = new mongoose.Schema({
    deviceId: {
        type: Number,
        required: true,
    },
    channel: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

// Create a model based on the schema
const Device = mongoose.model('Device', DeviceSchema);

// Array of 10 different Russian TV channels
const russianTvChannels = [
    'Первый канал (Channel One Russia)',
    'Россия 1 (Russia 1)',
    'НТВ (NTV)',
    'Матч ТВ (Match TV)',
    'ТВ Центр (TV Center)',
    'РЕН ТВ (REN TV)',
    'Пятый канал (Channel 5)',
    'СТС (STS)',
    'Домашний (Domashny)',
    'Культура (Russia-K) '
];

// Function to get a random TV channel from the array
const getRandomChannel = () => {
    const randomIndex = Math.floor(Math.random() * russianTvChannels.length);
    return russianTvChannels[randomIndex];
};

// Function to generate and save data every 5 seconds
const saveDataEvery5Seconds = () => {
    setInterval(async () => {
        try {
            const currentTime = Math.floor(Date.now() / 1000);  // Get the current time in seconds
            const deviceData = {
                deviceId: 100001,
                channel: getRandomChannel(), // Pick a random channel from the array
                time: currentTime,
            };

            // Create a new Device document
            const newDeviceData = new Device(deviceData);

            // Save to MongoDB
            await newDeviceData.save();
            console.log('Data saved:', deviceData);
        } catch (err) {
            console.log('Error saving data:', err);
        }
    }, 5000); // 5000 ms = 5 seconds
};

// Start saving data every 5 seconds
saveDataEvery5Seconds();
