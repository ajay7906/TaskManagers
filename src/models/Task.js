const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    descrption: {
        type: String,
        default: '',
    },
    dueDate: {
        type: Date,

    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
   
}, { timestamps: true })

module.exports = mongoose.model('Task', TaskSchema);