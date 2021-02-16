export type TodoFields = {
  todo: string;
  category: 'work' | 'personal' | 'errand';
  finished: boolean;
  id: string;
};
export type TodoType = Array<TodoFields>;
export type Response = {
  message: '';
  todos: TodoType;
};
