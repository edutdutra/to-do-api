import express from 'express';
import cors from 'cors'
import { v4 } from 'uuid';

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (req, res) => {
    const {name, username} = req.body;

    const userAlreadyExists = users.some((user) => user.username === username);

    if(userAlreadyExists) {
        return res.status(400).json({error: "Username already exists!"});
    }

    users.push({
        id: v4(),
        name,
        username,
        todos: []
    });

    return res.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

export default app