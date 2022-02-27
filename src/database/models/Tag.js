const mongoose = require('mongoose');
const { uid } = require('uid');
const { Schema } = mongoose;

const tagSchema = new Schema({
    id: { type: String, default: () => uid(6), unique: true },
    name: { type: String, required: true },
    guildId: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    creatorId: { type: String, required: true },
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
