const express = require('express');
const app = new express();

const cors = require('cors');
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const fileRouter = require('./src/routes/fileRouter');
app.use('', fileRouter)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});