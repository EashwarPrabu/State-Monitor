const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    ontime: {
        type: String,
        required: true
    },
    offtime: {
        type: String
    }
});

const State = mongoose.model('State', stateSchema);

module.exports = State;