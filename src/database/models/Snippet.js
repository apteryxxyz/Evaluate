const mongoose = require('mongoose');
const { uid } = require('uid');
const { Schema } = mongoose;

const snippetSchema = new Schema({
    id: { type: String, default: () => uid(7), unique: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Snippet = mongoose.model('Snippet', snippetSchema);
module.exports = Snippet;
