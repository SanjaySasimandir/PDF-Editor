require('dotenv').config();
const express = require('express');
const app = new express();

const cors = require('cors');
const corsOptions = {
    // origin: '*',  // Allow requests from any origin
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // enable set cookie
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const UserData = require('./src/models/userData');
const fileRouter = require('./src/routes/fileRouter');
app.use('', fileRouter)


function userdbtest() {
    var item = UserData({ username: 'test', password: 'test' });
    item.save();
}



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});