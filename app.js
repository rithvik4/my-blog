const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myblog', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Blog post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index.ejs', { posts });
});

app.get('/newpost', (req, res) => {
    res.render('newpost.ejs');
});

app.post('/newpost', async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.redirect('/');
});

// New route for handling post deletion
app.delete('/delete/:id', async (req, res) => {
    const postId = req.params.id;
    await Post.findByIdAndRemove(postId);
    res.redirect('/');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
