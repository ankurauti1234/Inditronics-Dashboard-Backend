require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./config/database");
const mqttClient = require("./mqttClient");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
// const authMiddleware = require("./middlewares/authMiddleware");
const { swaggerUi, specs } = require("../swagger");

const app = express();

app.use(cors());

app.use(express.json());

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.get('/api', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inditronics API</title>
    <style>
        :root {
            --primary: #3b82f6;
            --background: #ffffff;
            --foreground: #1f2937;
            --muted: #f3f4f6;
            --muted-foreground: #6b7280;
        }
        @media (prefers-color-scheme: light) {
            :root {
                --background: #1f2937;
                --foreground: #f9fafb;
                --muted: #374151;
                --muted-foreground: #9ca3af;
            }
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--background);
            color: var(--foreground);
            line-height: 1.5;
        }
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid var(--muted);
        }
        .logo {
            font-size: 1.25rem;
            font-weight: bold;
            color: var(--primary);
        }
        nav a {
            color: var(--foreground);
            text-decoration: none;
            margin-left: 1rem;
            font-size: 0.875rem;
        }
        nav a:hover {
            text-decoration: underline;
        }
        .hero {
            text-align: center;
            padding: 4rem 1rem;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .hero p {
            color: var(--muted-foreground);
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        .button {
            display: inline-block;
            background-color: var(--primary);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            text-decoration: none;
            font-weight: 500;
        }
        .button-outline {
            background-color: transparent;
            border: 1px solid var(--primary);
            color: var(--primary);
        }
        .endpoints {
            background-color: var(--muted);
            padding: 4rem 1rem;
        }
        .endpoints h2 {
            text-align: center;
            margin-bottom: 2rem;
        }
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        .card {
            background-color: var(--background);
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .card h3 {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        .card p {
            color: var(--muted-foreground);
            font-size: 0.875rem;
        }
        .documentation {
            text-align: center;
            padding: 4rem 1rem;
        }
        .documentation h2 {
            margin-bottom: 1rem;
        }
        .documentation p {
            color: var(--muted-foreground);
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        footer {
            border-top: 1px solid var(--muted);
            padding: 1rem;
            text-align: center;
            font-size: 0.875rem;
            color: var(--muted-foreground);
        }
    </style>
</head>
<body>
    <header>
        <div class="logo">Inditronics API</div>
        <nav>
            <a href="#endpoints">Endpoints</a>
            <a href="#documentation">Documentation</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Welcome to Inditronics API</h1>
                <p>Your gateway to powerful API services for industrial electronics and IoT solutions.</p>
                <a href="#documentation" class="button">Get Started</a>
                <a href="#endpoints" class="button button-outline">Explore API</a>
            </div>
        </section>

        <section id="endpoints" class="endpoints">
            <div class="container">
                <h2>Available Endpoints</h2>
                <div class="card-grid">
                    <div class="card">
                        <h3>Devices</h3>
                        <p>/api/v1/devices</p>
                        <p>Get information about all connected devices.</p>
                    </div>
                    <div class="card">
                        <h3>Status</h3>
                        <p>/api/v1/status</p>
                        <p>Check the current server status and health.</p>
                    </div>
                    <div class="card">
                        <h3>Alerts</h3>
                        <p>/api/v1/alerts</p>
                        <p>Fetch recent alerts and notifications for devices.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="documentation" class="documentation">
            <div class="container">
                <h2>API Documentation</h2>
                <p>Explore our comprehensive API documentation to get started with Inditronics API.</p>
                <a href="/api-docs" class="button">View Documentation</a>
            </div>
        </section>

        <section id="contact" class="documentation">
            <div class="container">
                <h2>Need Help?</h2>
                <p>Our support team is always ready to assist you with any questions or issues.</p>
                <a href="mailto:support@inditronics.com" class="button button-outline">Contact Support</a>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2023 Inditronics API. All rights reserved.</p>
            <nav>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy</a>
            </nav>
        </div>
    </footer>
</body>
</html>
    `);
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/sensor', sensorRoutes);
app.use("/api/mqtt", mqttRoutes);
app.use("/api/events", eventRoutes);

module.exports = app;