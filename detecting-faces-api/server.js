const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const cors = require ('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'wayock',
        password : '',
        database : 'smart-brain'
    }
});

db.select('*').from('users').then(data => {
    //console.log(data);
});

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
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register.'))
    
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
            console.log(user)
            res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
        // if (!found) {
        //     res.status(400).json('no such user');
        // }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, () => {
    console.log('app is running on port 3001')
})