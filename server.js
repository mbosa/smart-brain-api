const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* END POINTS
/ (root) --> GET
/signin --> POST (POST, not GET, because it's sending a password, and POST conceals it)
/register --> POST
/profile/:userId --> GET
/image --> PUT
*/

// / (root)
app.get('/', (req, res)=> { res.status(200).json('success') })
// /signin
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// /register --> add a new user
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// /profile/:id  (:id means that it accepts anything and it can be grabbed as req.params.id)
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

// /image --> update number of entries
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});

// app.listen(3000, ()=> {
//   console.log('app is running on port 3000');
// })
