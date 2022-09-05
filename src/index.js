import express from 'express';
import cors from 'cors'
import {v4} from 'uuid';

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
    const {username} = req.headers;

    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    req.user = user;
    return next();
}

app.post('/users', (req, res) => {
    const {name, username} = req.body;

    const userAlreadyExists = users.some((user) => user.username === username);

    if (userAlreadyExists) {
        return res.status(400).json({error: "Username already exists!"});
    }

    const newUser = {
        id: v4(),
        name,
        username,
        todos: []
    };

    users.push(newUser);

    return res.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
    const {user} = req;
    return res.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
    const {user} = req;
    const {title, deadline} = req.body;

    const newTodo = {
        id: v4(),
        title,
        done: false,
        deadline: new Date(deadline),
        createdAt: new Date()
    };

    user.todos.push(newTodo);

    return res.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
    const {user} = req;
    const {title, deadline} = req.body;
    const {id} = req.params;

    const todo = user.todos.find((todo) => todo.id === id);

    if(!todo) {
        return res.status(404).json({error: "ToDo not found"});
    }

    todo.title = title;
    todo.deadline = new Date(deadline);

    return res.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
    const {user} = req;
    const {id} = req.params;

    const todo = user.todos.find((todo) => todo.id === id);

    if(!todo) {
        return res.status(404).json({error: "ToDo not found"});
    }

    todo.done = true;

    return res.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
    const {user} = req;
    const {id} = req.params;

    const todo = user.todos.find((todo) => todo.id === id);

    if(!todo) {
        return res.status(404).json({error: "ToDo not found"});
    }

    user.todos.splice(todo, 1);

    return res.status(204);
});

export default app