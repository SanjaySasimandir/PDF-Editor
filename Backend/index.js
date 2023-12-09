require('dotenv').config();
const express = require('express');
const app = new express();

const UserData = require('./src/models/userData');

var item = UserData({ username: 'test', password: 'test' });
item.save();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});