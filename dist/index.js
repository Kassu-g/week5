"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env');
    process.exit(1);
}
mongoose_1.default.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connection error:', err));
app.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo } = req.body;
    let user = yield User_1.default.findOne({ name });
    if (!user) {
        user = new User_1.default({ name, todos: [{ todo, checked: false }] });
    }
    else {
        user.todos.push({ todo, checked: false });
    }
    yield user.save();
    res.json(user);
}));
app.get('/todos/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const user = yield User_1.default.findOne({ name });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.todos);
}));
app.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo } = req.body;
    const user = yield User_1.default.findOne({ name });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.todos = user.todos.filter(t => t.todo !== todo);
    yield user.save();
    res.json(user.todos);
}));
app.put('/updateTodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo, checked } = req.body;
    const user = yield User_1.default.findOne({ name });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const item = user.todos.find(t => t.todo === todo);
    if (!item) {
        return res.status(404).json({ message: 'Todo not found' });
    }
    item.checked = checked;
    yield user.save();
    res.json(user.todos);
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
