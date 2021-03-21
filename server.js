const express = require('express');
const connectDB = require('./config/db');
const socket = require('./routes/api/socket');
const path = require('path');
require('dotenv/config');

const app = express();
app.use(require('cors')());
const server = require('http').createServer(app);

// Connect Database
connectDB();

// Connect Socket
socket(server, app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Socket server started on port ${PORT}`));
