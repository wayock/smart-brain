const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require ('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'johnnybgood@hotmail.com',
            password: "chuckberry",
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sue',
            email: 'sueme@hotmail.com',
            password: "pleasedont",
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    bcrypt.compare("apples", "$2a$10$x4El9mdNdEoJSmsorxBM9uXUR7ksN5TdOjM2QwNpXITjvsdoun8hq", function(err, res) {
        console.log("first guess", res)
    });
    bcrypt.compare("not_bacon", "$2a$10$x4El9mdNdEoJSmsorxBM9uXUR7ksN5TdOjM2QwNpXITjvsdoun8hq", function(err, res) {
        console.log("second guess", res)
    });
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password} = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            console.log(hash);
        });
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('no such user');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('no such user');
    }
})

app.listen(3001, () => {
    console.log('app is running on port 3001')
})