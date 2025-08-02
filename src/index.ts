import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import User, { ITodo, IUser } from './models/User';

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo connection error:', err));

app.post('/add', async (req: Request, res: Response) => {
  const { name, todo } = req.body as { name: string; todo: string };
  let user = await User.findOne({ name });
  if (!user) {
    user = new User({ name, todos: [{ todo, checked: false }] });
  } else {
    user.todos.push({ todo, checked: false });
  }
  await user.save();
  res.json(user);
});

app.get('/todos/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user.todos);
});

app.put('/update', async (req: Request, res: Response) => {
  const { name, todo } = req.body as { name: string; todo: string };
  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.todos = user.todos.filter(t => t.todo !== todo);
  await user.save();
  res.json(user.todos);
});

app.put('/updateTodo', async (req: Request, res: Response) => {
  const { name, todo, checked } = req.body as { name: string; todo: string; checked: boolean };
  const user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const item = user.todos.find(t => t.todo === todo);
  if (!item) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  item.checked = checked;
  await user.save();
  res.json(user.todos);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
