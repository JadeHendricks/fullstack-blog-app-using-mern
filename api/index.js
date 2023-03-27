const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/User");
const connectDB = require('./db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const app = express();
const cookieParser = require("cookie-parser");

const salt = bcrypt.genSaltSync(10);

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, 
    origin: process.env.FE_ORIGIN_URL
}));
connectDB();

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userPayload = await User.create({
            username, 
            password: bcrypt.hashSync(password, salt)
        })
        
        res.json(userPayload);   
    } catch (error) {
        res.status(400).json(error)
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
        const userPayload = await User.findOne({ username });
        const usersPasswordsMatch = bcrypt.compareSync(password, userPayload.password)

        if (usersPasswordsMatch) {
            jwt.sign({ username, id: userPayload._id}, process.env.JWT_SECRET, {}, (error, token) => {
                if (error) throw error;
                res.cookie("token", token).json({
                    id: userPayload._id,
                    username
                });
            })
        } else {
            res.status(401).json("Username or password are incorrect!")
        }
});

app.get('/profile', (req,res) => {
    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
        if (err) throw err;
        res.json(decoded);
    });
  });

  app.post('/logout', (req, res) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        message: 'success'
    });
  });

app.listen(process.env.PORT);