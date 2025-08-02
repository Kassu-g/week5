import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import User, { ITodo } from './models/User';

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI!);

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
  const user = await User.findOne({ name: req.params.name });
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.json(user.todos);
});

app.put('/update', async (req: Request, res: Response) => {
  const { name, todo } = req.body as { name: string; todo: string };
  const user = await User.findOne({ name });
  if (!user) return res.status(404).send({ message: 'User not found' });
  user.todos = user.todos.filter(t => t.todo !== todo);
  await user.save();
  res.json(user.todos);
});
app.put('/updateTodo', async (req: Request, res: Response) => {
  const { name, todo, checked } = req.body as { name: string; todo: string; checked: boolean };
  const user = await User.findOne({ name });
  if (!user) return res.status(404).send({ message: 'User not found' });
  const item = user.todos.find(t => t.todo === todo);
  if (!item) return res.status(404).send({ message: 'Todo not found' });
  item.checked = checked;
  await user.save();
  res.json(user.todos);
});

app.listen(3000, () => console.log('Listening on port 3000'));
