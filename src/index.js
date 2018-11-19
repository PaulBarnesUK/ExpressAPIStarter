const express = require('express');
const app = module.exports = express();
const expressMongo = require('express-mongo-db');
const port = 3500;

// Autoload database 
app.use(expressMongo('mongodb://127.0.0.1:27017/test'));

// Autoload controller routes
require('./lib/boot.js')(app);

app.listen(port, () => console.log(`Development server running on port ${port}`));