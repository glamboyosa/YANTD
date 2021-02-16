import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { redisClient } from './helpers/redis';
import { v4 as uuidv4 } from 'uuid';
//  types
type todosType = Array<{
  todo: string;
  category: string;
  finished: boolean;
  id: string;
}>;
type reqTypes = {
  todo: string;
  category: string;
  finished: boolean;
  id: string;
};
const app = express();
// redisClient.flushall();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send(`<h1>So it doesn't say "Failed to get"</h1>`);
});
app.get('/api/todos', (_, res) => {
  redisClient.get('todos', (err, data) => {
    if (err) {
      return res.status(404).send({ message: err.message, todos: [] });
    }
    if (!data) {
      return res.status(404).send({ message: 'Not Found', todos: [] });
    }
    res.status(200).send({ message: 'success', todos: JSON.parse(data) });
  });
});
app.post('/api/todos', (req, res) => {
  const { category, todo }: reqTypes = req.body;
  let todos: todosType = [];
  redisClient.get('todos', (err, data) => {
    if (err) {
      return res.status(404).send({ message: err.message, todos: [] });
    }
    if (!data) {
      const newTodoArray: todosType = [];
      newTodoArray.push({ id: uuidv4(), todo, category, finished: false });
      redisClient.setex(
        'todos',
        60 * 60 * 24 * 7,
        JSON.stringify(newTodoArray)
      );
      return res.status(200).send({ message: 'success', todos: newTodoArray });
    }
    todos = JSON.parse(data);

    if (todos.length) {
      todos.push({ id: uuidv4(), todo, category, finished: false });
      redisClient.setex('todos', 60 * 60 * 24 * 7, JSON.stringify(todos));
      return res.status(200).send({ message: 'success', todos });
    }
  });
});
app.put('/api/todos/:id', (req, res) => {
  const { finished }: reqTypes = req.body;
  const { id } = req.params;
  let todos: todosType = [];
  redisClient.get('todos', (err, data) => {
    if (err) {
      return res.status(404).send({ message: err.message, todos: [] });
    }
    if (!data) {
      return res.status(404).send({ message: 'No Data Found', todos: [] });
    }

    todos = JSON.parse(data);

    const otherTodoItems = todos.filter((el) => el.id !== id);

    const updatedTodo = todos.filter((el) => el.id === id)[0];
    updatedTodo.finished = finished;
    otherTodoItems.push(updatedTodo);
    redisClient.setex(
      'todos',
      60 * 60 * 24 * 7,
      JSON.stringify(otherTodoItems)
    );
    res.status(200).send({ message: true });
  });
});
const port = 4000 || process.env.PORT;
app.listen(port, () => console.log(`Started on ${port} ⚡`));
