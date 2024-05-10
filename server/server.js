const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const { signIn, welcome, refresh, logout } = require("./handlers")

const app = express();
app.use(cookieParser());

var rawBodyHandler = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
app.options('*', cors());  // enable pre-flight

app.use(bodyParser.json({ verify: rawBodyHandler }));

app.get('/', (req, res) => {
    res.send('Hello World');
})

const PORT = process.env.PORT || 8080;

const user = "prabhat5172992@gmail.com";

app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    
    if (username && password && /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        fs.readFile('userlist.json', 'utf8', (err, data) => {
            const d = JSON.parse(data);
            if (!d.find(item => item.email === email)) {
                d.push({
                    username,
                    email,
                    password
                });

                fs.writeFile('userlist.json', JSON.stringify(d, null, 4), (err) => {
                    if (err) throw err;
                    else {
                        return res.send(signIn(req, res, d));
                    }
                });
            } else {
                res.status(400).send({"message": "User already exists!"});
            }
        });
        // signIn(req, res);
    } else {
        res.status(400).send({ "message": "Data is not correct!"})
    }
});

app.put('/signup', (req, res) => {
    const { email, password } = req.body;

    fs.readFile('userlist.json', 'utf8', (err, data) => {
        const d = JSON.parse(data);
        console.log("--0", email, password, d.find(item => item.email === email));
        if(!d.find(item => item.email === email)) {
            res.status(400).send({ "message": "User doesn't exit!" })
        } else {
            const changedData = d.map(item => {
                if(item.email === email) {
                    item.password = password;
                }
                return item;
            });
    
            fs.writeFile('userlist.json', JSON.stringify(changedData, null, 4), (err) => {
                if (err) throw err;
                res.status(200).send("Update successful!");
            });
        }
    });
});

app.post('/signin', signIn);
app.get('/welcome', welcome);
app.post('/refresh', refresh);
app.get('/logout', logout);

app.post('/addNotes', (req, res) => {
    const { notes } = req.body;

    fs.readFile('user-notes.json', 'utf8', (err, data) => {
        const d = JSON.parse(data);
        d[user].push({
            id: uuidv4(),
            notes
        });

        fs.writeFile('user-notes.json', JSON.stringify(d, null, 4), (err) => {
            if (err) throw err;
        });
    });

    res.status(200).send({ 'message': 'Successfully added notes!' });
});

app.get('/getNotes', (req, res) => {
    fs.readFile('user-notes.json', 'utf8', (err, data) => {
        const notesData = JSON.parse(data)[user];
        res.status(200).send(notesData);
    });
});

app.delete('/deleteNotes', (req, res) => {
    const { id } = req.body;

    fs.readFile('user-notes.json', 'utf8', (err, data) => {
        const d = JSON.parse(data);

        d[user] = [...d[user].filter(item => item.id !== id)];

        fs.writeFile('user-notes.json', JSON.stringify(d, null, 4), (err) => {
            if (err) throw err;
        });
    });
});

app.post('/addtodo', (req, res) => {
    const { todo } = req.body;

    fs.readFile('todos.json', 'utf8', (err, data) => {
        const d = JSON.parse(data);
        d.allTodos.push({
            id: uuidv4(),
            todo
        });

        fs.writeFile('todos.json', JSON.stringify(d, null, 4), (err) => {
            if (err) throw err;
        });
    });

    res.status(200).send({ 'message': 'Successfully added todo!' });
});

app.get('/getAllTodos', (req, res) => {
    fs.readFile('todos.json', 'utf8', (err, data) => {
        res.status(200).send(data);
    });
});

app.put('/updateTodos', (req, res) => {
    const { id, type } = req.body;
    const d = { "allTodos": [], "completedTodos": [] }

    fs.readFile('todos.json', 'utf8', (err, data) => {
        const todoData = JSON.parse(data);
        d.completedTodos = [...todoData.completedTodos];

        if (type === "all") {
            todoData.allTodos.forEach(element => {
                if (element.id === id) {
                    d.completedTodos.push(element);
                } else {
                    d.allTodos.push(element);
                }
            });
        }

        if (type === "completed") {
            d.allTodos = [...todoData.allTodos]
            d.completedTodos = todoData.completedTodos.filter(item => item.id !== id);
        }

        fs.writeFile('todos.json', JSON.stringify(d, null, 4), (err) => {
            if (err) throw err;
        });
    });

    res.status(200).send({ 'message': 'Successfully updated' })
});

app.listen(PORT, () => {
    console.log('App is running on port: ', PORT);
});
