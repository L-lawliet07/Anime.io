const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Crew name is required'],
        unique: true
    },
    image: {
        type: String,
        default: 'default.png'
    },
    members: [
        // Iam thing of adding their object value
    ],
    message: [{
        timestamp: { type: Date, default: Date.now },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
});

const crew = mongoose.model('Crew', crewSchema);

module.exports = crew;