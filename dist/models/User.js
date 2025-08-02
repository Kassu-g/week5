"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    todo: { type: String, required: true },
    checked: { type: Boolean, default: false }
});
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    todos: { type: [TodoSchema], default: [] }
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
