import { Schema, model, Document } from 'mongoose';
export interface ITodo {
  todo: string;
  checked: boolean;
}
const TodoSchema = new Schema<ITodo>({
  todo:    { type: String, required: true },
  checked: { type: Boolean, default: false }
});

export interface IUser extends Document {
  name: string;
  todos: ITodo[];
}

const UserSchema = new Schema<IUser>({
  name:  { type: String, required: true, unique: true },
  todos: { type: [TodoSchema], default: [] }
});

export default model<IUser>('User', UserSchema);
