const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/User");
const Post = require('./models/Post');
const connectDB = require('./db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const app = express();
const cookieParser = require("cookie-parser");
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
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

  app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  
    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
  
  });
  
  app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.update({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);
    });
  
  });
  
  app.get('/post', async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  });
  
  app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

app.listen(process.env.PORT);