const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    files: Array
});

const User = mongoose.model('User', UserSchema);

module.exports = User;