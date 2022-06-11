const express = require('express');
const router = require('./routes');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

const app = express();

dbConnection();

app.use( express.static('public') );

app.use(cors())

const whiteList = [ 'http://localhost:4200' ];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

