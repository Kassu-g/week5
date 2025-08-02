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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI);
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
    const user = yield User_1.default.findOne({ name: req.params.name });
    if (!user)
        return res.status(404).send({ message: 'User not found' });
    res.json(user.todos);
}));
app.put('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo } = req.body;
    const user = yield User_1.default.findOne({ name });
    if (!user)
        return res.status(404).send({ message: 'User not found' });
    user.todos = user.todos.filter(t => t.todo !== todo);
    yield user.save();
    res.json(user.todos);
}));
app.put('/updateTodo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, todo, checked } = req.body;
    const user = yield User_1.default.findOne({ name });
    if (!user)
        return res.status(404).send({ message: 'User not found' });
    const item = user.todos.find(t => t.todo === todo);
    if (!item)
        return res.status(404).send({ message: 'Todo not found' });
    item.checked = checked;
    yield user.save();
    res.json(user.todos);
}));
app.listen(3000, () => console.log('Listening on port 3000'));
