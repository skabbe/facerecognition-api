import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';
import handleRegister from './controllers/register.js'
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'facerecognition'
    }
})

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config()



app.get('/', (req, res) => { res.json('it is working!') })
app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { handleRegister(req, res, bcrypt, db) })
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { handleApiCall(req, res) })


const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`App is running on port on ${PORT}`);
})




/*
/ --> res = 'This is working'
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> user

*/
