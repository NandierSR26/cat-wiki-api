const express = require('express');
const router = require('./routes');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

const app = express();

dbConnection();

app.use(cors())

app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

