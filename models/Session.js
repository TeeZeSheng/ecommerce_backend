const mongoose = require('mongoose');

// Define the session schema and model
const sessionSchema = new mongoose.Schema({}, { strict: false });
const Session = mongoose.model('Session', sessionSchema, 'sessions'); // 'sessions' is the collection name
module.exports = Session;