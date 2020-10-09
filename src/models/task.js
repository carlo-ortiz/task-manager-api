const mongoose = require('mongoose')


const mongooseSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,

    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', mongooseSchema)

module.exports = Task